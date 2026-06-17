import { config } from "../config";
import { logger } from "../logger";
import { getStore } from "../redis";
import { emitEvent } from "../events";
import { keys, saveSession, loadSession, bumpStat } from "../store/sessionStore";
import type { Concept, Question, SessionState } from "../../shared/types";
import type { KBConcept } from "../domain/curriculum";
import type { Blueprint } from "./types";
import { teach } from "./tutor";
import { makeQuestion, toPublicQuestion } from "./assessor";
import { evaluate } from "./diagnostician";
import { answerAs } from "./learner";
import { getUsage, isLive } from "./llm";
import { personalizeQuestion } from "./questionGen";
import { scenarioFor } from "../domain/scenarios";

// ---------------------------------------------------------------------------
// The Orchestrator is the autonomous core. Given a goal it drives the full
// loop — plan, teach, assess, diagnose, adapt — with no human micro-management.
// In autopilot mode a simulated learner closes the loop so the entire run is
// hands-off. The headline autonomous behavior is emergent remediation: when the
// diagnostician detects a prerequisite gap, the orchestrator rewrites its own
// plan mid-run, injecting a remedial micro-lesson it never originally planned.
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Pacing between autopilot steps so the control room animates on screen.
// Set to 0 in tests for instant, deterministic runs.
const STEP_DELAY_MS = Number(process.env.AGORA_STEP_DELAY_MS ?? 700);
const MAX_ATTEMPTS = 3;

// In-process lock so a session is only ever advanced by one loop at a time.
const running = new Set<string>();

async function persistBlueprint(sessionId: string, bp: Blueprint): Promise<void> {
  await getStore().setJSON(keys.blueprint(sessionId), bp, 60 * 60 * 6);
}

async function loadBlueprint(sessionId: string): Promise<Blueprint | null> {
  return getStore().getJSON<Blueprint>(keys.blueprint(sessionId));
}

const findKb = (bp: Blueprint, id: string) => bp.concepts.find((c) => c.key === id);
const findPub = (s: SessionState, id: string) =>
  s.plan?.concepts.find((c) => c.id === id);

function recompute(session: SessionState): void {
  const concepts = session.plan?.concepts ?? [];
  const mastered = concepts.filter((c) => c.status === "mastered");
  session.masteryAvg = concepts.length
    ? concepts.reduce((a, c) => a + c.mastery, 0) / concepts.length
    : 0;
  session.metrics.conceptsMastered = mastered.length;
  const usage = getUsage();
  session.metrics.llmCalls = usage.llmCalls;
  session.metrics.tokensApprox = usage.tokensApprox;
}

// A snapshot event lets the UI render plan, metrics and status purely from the
// event stream — no polling required.
async function snapshot(session: SessionState): Promise<void> {
  await emitEvent({
    sessionId: session.id,
    agent: "orchestrator",
    type: "snapshot",
    title: "state",
    data: { session },
  });
}

// --------------------------------- Steps -----------------------------------

async function teachStep(session: SessionState, bp: Blueprint): Promise<void> {
  const id = session.currentConceptId!;
  const kb = findKb(bp, id)!;
  const pub = findPub(session, id)!;

  await emitEvent({
    sessionId: session.id,
    agent: "orchestrator",
    type: "decision",
    title: `Route to Tutor → "${kb.title}"`,
    detail:
      pub.attempts > 0
        ? "Re-teaching at a deeper level after a missed check."
        : `Teaching a ${kb.difficulty} concept.`,
    data: { conceptId: id, attempt: pub.attempts },
  });

  pub.status = pub.attempts > 0 ? "remediating" : "teaching";
  const lesson = await teach(kb, pub.attempts);
  session.metrics.lessonsDelivered += 1;

  await emitEvent({
    sessionId: session.id,
    agent: "tutor",
    type: "lesson",
    title: lesson.title,
    detail: lesson.body,
    data: { lesson },
  });

  session.nextAction = "assess";
  recompute(session);
  await saveSession(session);
  await snapshot(session);
}

// Returns the gradeable question (with answers) and stores it server-side.
async function assessStep(session: SessionState, bp: Blueprint): Promise<Question> {
  const id = session.currentConceptId!;
  const kb = findKb(bp, id)!;
  const pub = findPub(session, id)!;

  const baseQuestion = makeQuestion(kb, pub.attempts);
  let question = baseQuestion;

  // With a live LLM, personalize the exercise as an avatar-themed scene targeted
  // to the learner's interests. Answer choices stay anchored to the verified KB.
  if (isLive()) {
    await emitEvent({
      sessionId: session.id,
      agent: "assessor",
      type: "thinking",
      title: `Crafting a personalized challenge for ${session.learner.name}`,
    });
    question = await personalizeQuestion(baseQuestion, kb.title, session.learner, scenarioFor(bp.topicId));
  }

  pub.status = "assessing";

  await getStore().setJSON(keys.grading(session.id), [question], 60 * 60 * 6);

  const publicQ = toPublicQuestion(question);
  session.pendingQuestions = [publicQ];

  await emitEvent({
    sessionId: session.id,
    agent: "assessor",
    type: "questions",
    title: `Checking understanding of "${kb.title}"`,
    detail: question.prompt,
    data: { question: publicQ },
  });

  recompute(session);
  await saveSession(session);
  await snapshot(session);
  return question;
}

async function diagnoseStep(
  session: SessionState,
  bp: Blueprint,
  question: Question,
  answer: number | string,
): Promise<void> {
  const kb = findKb(bp, question.conceptId)!;
  const pub = findPub(session, question.conceptId)!;

  // The active question has now been consumed; drop the gradeable set so a
  // stale questionId can never be re-graded.
  await getStore().del(keys.grading(session.id));

  await emitEvent({
    sessionId: session.id,
    agent: "orchestrator",
    type: "thinking",
    title: "Diagnostician analyzing the answer",
  });

  const evaluation = await evaluate(kb, question, answer);
  session.metrics.questionsAsked += 1;
  if (evaluation.correct) session.metrics.correctAnswers += 1;
  session.lastEvaluation = evaluation;
  session.pendingQuestions = null;
  pub.attempts += 1;

  await emitEvent({
    sessionId: session.id,
    agent: "diagnostician",
    type: "evaluation",
    title: evaluation.correct ? "Answer correct" : "Answer incorrect",
    detail: evaluation.feedback,
    data: { evaluation },
  });

  if (evaluation.correct) {
    pub.mastery = pub.attempts <= 1 ? 0.95 : 0.85;
    pub.status = "mastered";
    await emitEvent({
      sessionId: session.id,
      agent: "diagnostician",
      type: "mastery.update",
      title: `"${kb.title}" mastered`,
      data: { conceptId: pub.id, mastery: pub.mastery },
    });
    session.nextAction = "advance";
    recompute(session);
    await saveSession(session);
    await snapshot(session);
    return;
  }

  // Wrong answer: decide between emergent remediation, deeper re-teach, or a
  // graceful give-up after too many attempts.
  pub.mastery = 0.35;
  const remediationKey = `${kb.key}__rem`;
  const alreadyRemediated = bp.concepts.some((c) => c.key === remediationKey);

  if (kb.remediation && !alreadyRemediated) {
    const rem = kb.remediation;
    const remKb: KBConcept = {
      key: remediationKey,
      title: rem.title,
      difficulty: "intro",
      summary: rem.summary,
      analogy: rem.analogy,
      keyPoints: rem.keyPoints,
      deeperBody: rem.summary,
      questions: [rem.question],
    };
    const remPub: Concept = {
      id: remediationKey,
      title: rem.title,
      summary: rem.summary,
      difficulty: "intro",
      status: "pending",
      mastery: 0,
      attempts: 0,
      injected: true,
      unblocks: kb.key,
    };

    // Insert the remediation immediately before the failed concept, in both the
    // server blueprint and the client-facing plan, then re-point at it.
    const bpIdx = bp.concepts.findIndex((c) => c.key === kb.key);
    bp.concepts.splice(bpIdx, 0, remKb);
    const pubIdx = session.plan!.concepts.findIndex((c) => c.id === kb.key);
    session.plan!.concepts.splice(pubIdx, 0, remPub);

    pub.status = "remediating";
    session.currentConceptId = remediationKey;
    session.metrics.remediationsInjected += 1;
    await bumpStat("remediations_injected");

    await emitEvent({
      sessionId: session.id,
      agent: "diagnostician",
      type: "remediation",
      title: "Prerequisite gap detected — re-planning",
      detail: `Missing: ${evaluation.prerequisiteGap ?? rem.title}. Injecting a remedial micro-lesson before retrying "${kb.title}".`,
      data: {
        misconception: evaluation.misconception,
        prerequisiteGap: evaluation.prerequisiteGap,
        injectedConceptId: remediationKey,
        forConceptId: kb.key,
      },
    });
    await emitEvent({
      sessionId: session.id,
      agent: "orchestrator",
      type: "plan.updated",
      title: "Plan rewritten autonomously",
      detail: `Added "${rem.title}" to unblock "${kb.title}".`,
      data: { plan: session.plan },
    });

    session.nextAction = "teach";
    await persistBlueprint(session.id, bp);
    recompute(session);
    await saveSession(session);
    await snapshot(session);
    return;
  }

  if (pub.attempts >= MAX_ATTEMPTS) {
    pub.mastery = 0.6;
    pub.status = "mastered";
    await emitEvent({
      sessionId: session.id,
      agent: "orchestrator",
      type: "decision",
      title: `Advancing past "${kb.title}" with partial mastery`,
      detail: "Reached the attempt limit; moving on to keep the learner progressing.",
    });
    session.nextAction = "advance";
  } else {
    pub.status = "remediating";
    await emitEvent({
      sessionId: session.id,
      agent: "orchestrator",
      type: "decision",
      title: `Re-teaching "${kb.title}" more concretely`,
      detail: "The check was missed; the Tutor will try a deeper explanation.",
    });
    session.nextAction = "teach";
  }
  recompute(session);
  await saveSession(session);
  await snapshot(session);
}

async function advanceStep(session: SessionState): Promise<void> {
  const next = session.plan!.concepts.find((c) => c.status !== "mastered");
  if (!next) {
    session.nextAction = "complete";
    return;
  }
  session.currentConceptId = next.id;
  session.nextAction = "teach";
  await emitEvent({
    sessionId: session.id,
    agent: "orchestrator",
    type: "decision",
    title: `Next concept → "${next.title}"`,
    data: { conceptId: next.id },
  });
  recompute(session);
  await saveSession(session);
  await snapshot(session);
}

async function completeStep(session: SessionState): Promise<void> {
  session.status = "completed";
  session.nextAction = "complete";
  session.pendingQuestions = null;
  recompute(session);
  const total = session.plan!.concepts.length;
  session.summary = {
    goal: session.goal,
    conceptsMastered: session.metrics.conceptsMastered,
    conceptsTotal: total,
    remediationsInjected: session.metrics.remediationsInjected,
    steps: session.stepCount,
    durationMs: Date.now() - session.createdAt,
    masteryAvg: session.masteryAvg,
    headline:
      session.metrics.remediationsInjected > 0
        ? `Goal reached autonomously — the system re-planned ${session.metrics.remediationsInjected} time(s) to close prerequisite gaps.`
        : "Goal reached autonomously end-to-end.",
  };
  await bumpStat("sessions_completed");
  await bumpStat("concepts_mastered", session.metrics.conceptsMastered);
  await bumpStat("lessons_delivered", session.metrics.lessonsDelivered);
  await saveSession(session);
  await emitEvent({
    sessionId: session.id,
    agent: "orchestrator",
    type: "run.complete",
    title: "Learning goal achieved",
    detail: session.summary.headline,
    data: { summary: session.summary },
  });
  await snapshot(session);
}

// ------------------------------- Run loop ----------------------------------

async function runLoop(sessionId: string): Promise<void> {
  if (running.has(sessionId)) return;
  running.add(sessionId);
  try {
    const session = await loadSession(sessionId);
    const bp = await loadBlueprint(sessionId);
    if (!session || !bp) return;
    if (session.status === "completed" || session.status === "error") return;
    session.status = "running";

    while (session.stepCount < config.maxRunSteps) {
      session.stepCount += 1;

      if (session.nextAction === "teach") {
        await teachStep(session, bp);
        if (session.mode === "autopilot") await sleep(STEP_DELAY_MS);
        continue;
      }

      if (session.nextAction === "assess") {
        const question = await assessStep(session, bp);
        if (session.mode === "interactive") {
          session.status = "awaiting_input";
          session.nextAction = "diagnose";
          await saveSession(session);
          await emitEvent({
            sessionId: session.id,
            agent: "assessor",
            type: "awaiting-input",
            title: "Waiting for the learner's answer",
            data: { question: toPublicQuestion(question) },
          });
          await snapshot(session);
          return; // hand control back to the human; resumes on submitAnswer
        }
        // Autopilot: the Learner agent answers, then we diagnose.
        await sleep(STEP_DELAY_MS);
        const kb = findKb(bp, question.conceptId)!;
        const pub = findPub(session, question.conceptId)!;
        const decision = answerAs(kb, question, session.learner.simulatedSkill, pub.attempts - 0);
        await emitEvent({
          sessionId: session.id,
          agent: "learner",
          type: "answer.received",
          title:
            question.type === "mcq"
              ? `Learner picks: ${question.choices?.[decision.answer as number] ?? decision.answer}`
              : "Learner responds",
          detail: decision.rationale,
          data: { answer: decision.answer, confident: decision.confident },
        });
        await sleep(STEP_DELAY_MS);
        await diagnoseStep(session, bp, question, decision.answer);
        if (session.mode === "autopilot") await sleep(STEP_DELAY_MS);
        continue;
      }

      if (session.nextAction === "advance") {
        await advanceStep(session);
        if (session.mode === "autopilot") await sleep(STEP_DELAY_MS);
        continue;
      }

      if (session.nextAction === "complete") {
        await completeStep(session);
        break;
      }

      // Unexpected state (e.g. 'diagnose' without a submitted answer): surface
      // it as an error rather than silently leaving the session stuck.
      session.status = "error";
      await saveSession(session);
      await emitEvent({
        sessionId: session.id,
        agent: "orchestrator",
        type: "error",
        title: "Run stopped in an unexpected state",
        detail: `No handler for next action "${session.nextAction}".`,
      });
      await snapshot(session);
      break;
    }

    if (session.stepCount >= config.maxRunSteps && (session.status as string) !== "completed") {
      session.status = "error";
      await saveSession(session);
      await emitEvent({
        sessionId: session.id,
        agent: "orchestrator",
        type: "error",
        title: "Run halted at the safety step limit",
      });
      await snapshot(session);
    }
  } catch (err) {
    logger.error({ err: (err as Error).message, sessionId }, "run loop failed");
    const session = await loadSession(sessionId);
    if (session) {
      session.status = "error";
      await saveSession(session);
      await emitEvent({
        sessionId,
        agent: "orchestrator",
        type: "error",
        title: "The run hit an unexpected error",
        detail: (err as Error).message,
      });
    }
  } finally {
    running.delete(sessionId);
  }
}

// ------------------------------- Public API --------------------------------

export async function startRun(session: SessionState, bp: Blueprint): Promise<void> {
  await persistBlueprint(session.id, bp);
  session.currentConceptId = session.plan!.concepts[0]?.id ?? null;
  session.nextAction = "teach";
  session.status = "running";
  await saveSession(session);
  await emitEvent({
    sessionId: session.id,
    agent: "planner",
    type: "plan.created",
    title: `Planned ${session.plan!.concepts.length} concepts for "${session.goal}"`,
    detail: session.plan!.rationale,
    data: { plan: session.plan },
  });
  await snapshot(session);
  void runLoop(session.id);
}

export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answer: number | string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const session = await loadSession(sessionId);
  if (!session) return { ok: false, reason: "session not found" };
  if (session.status !== "awaiting_input") return { ok: false, reason: "session is not awaiting input" };
  // Claim the per-session lock synchronously (no await between check and add) so
  // a double-submit cannot diagnose the same answer twice or double-inject a
  // remediation. The loser of the race gets a clean "busy".
  if (running.has(sessionId)) return { ok: false, reason: "a step is already in progress" };
  running.add(sessionId);

  try {
    const bp = await loadBlueprint(sessionId);
    if (!bp) return { ok: false, reason: "blueprint missing" };

    const grading = await getStore().getJSON<Question[]>(keys.grading(sessionId));
    const question = grading?.find((q) => q.id === questionId) ?? grading?.[0];
    if (!question) return { ok: false, reason: "no active question" };

    await emitEvent({
      sessionId,
      agent: "learner",
      type: "answer.received",
      title: "Learner submitted an answer",
      data: { answer },
    });

    session.status = "running";
    await saveSession(session);
    await diagnoseStep(session, bp, question, answer);
  } finally {
    // Release before resuming the loop, which re-acquires the lock itself.
    running.delete(sessionId);
  }

  void runLoop(sessionId);
  return { ok: true };
}
