import { Router } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { logger } from "../logger";
import { providerName } from "../agents/llm";
import { planLearningPath, planFromTopic } from "../agents/planner";
import { buildCategoryTopic } from "../agents/categoryPlanner";
import { startRun, submitAnswer } from "../agents/orchestrator";
import { saveSession, loadSession, bumpStat } from "../store/sessionStore";
import { replayEvents } from "../events";
import type { SessionState } from "../../shared/types";

export const sessionsRouter = Router();

const createSchema = z.object({
  goal: z.string().trim().min(3).max(160),
  mode: z.enum(["autopilot", "interactive"]).default("autopilot"),
  learnerName: z.string().trim().max(40).optional(),
  simulatedSkill: z.coerce.number().min(0).max(1).optional(),
  interests: z.array(z.string().trim().min(1).max(40)).max(10).optional(),
  avatar: z
    .object({
      skin: z.string().max(16),
      hair: z.enum(["short", "long", "buzz", "ponytail", "curly", "bald"]),
      hairColor: z.string().max(16),
      shirt: z.string().max(16),
      pants: z.string().max(16),
      shoes: z.string().max(16),
    })
    .optional(),
  cursus: z.enum(["college", "lycee"]).optional(),
  niveau: z.string().max(20).optional(),
  subjectId: z.string().max(40).optional(),
  categoryId: z.string().max(60).optional(),
});

const DEFAULT_AVATAR = {
  skin: "#f1c27d",
  hair: "short" as const,
  hairColor: "#1f2937",
  shirt: "#4f46e5",
  pants: "#334155",
  shoes: "#f43f5e",
};

const answerSchema = z.object({
  questionId: z.string().min(1),
  answer: z.union([z.number(), z.string()]),
});

// Create a learning session: the Planner builds the concept graph, then the
// autonomous run starts immediately (fire-and-forget; the client watches SSE).
sessionsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid request", details: parsed.error.flatten() });
  }
  const { goal, mode, learnerName, simulatedSkill, interests, avatar, cursus, niveau, subjectId, categoryId } =
    parsed.data;

  // A curriculum category practice generates its path with the LLM; otherwise we
  // plan from the seed knowledge base.
  const { plan, blueprint } =
    subjectId && categoryId
      ? planFromTopic(
          goal,
          await buildCategoryTopic({
            cursus: cursus ?? "college",
            niveau,
            subjectId,
            categoryId,
            goal,
            interests: interests ?? [],
          }),
        )
      : planLearningPath(goal);

  const now = Date.now();
  const session: SessionState = {
    id: nanoid(12),
    goal,
    mode,
    status: "idle",
    llmProvider: providerName(),
    plan,
    currentConceptId: null,
    nextAction: "plan",
    masteryAvg: 0,
    stepCount: 0,
    learner: {
      name: learnerName?.trim() || (mode === "autopilot" ? "Simulated learner" : "You"),
      simulatedSkill: simulatedSkill ?? 0.7,
      interests: interests ?? [],
      avatar: avatar ?? DEFAULT_AVATAR,
      cursus,
    },
    pendingQuestions: null,
    lastEvaluation: null,
    metrics: {
      lessonsDelivered: 0,
      questionsAsked: 0,
      correctAnswers: 0,
      remediationsInjected: 0,
      conceptsMastered: 0,
      llmCalls: 0,
      tokensApprox: 0,
    },
    summary: null,
    createdAt: now,
    updatedAt: now,
  };

  await saveSession(session);
  await bumpStat("sessions_started");
  await startRun(session, blueprint);

  logger.info({ sessionId: session.id, goal, mode }, "session started");
  res.status(201).json({ session });
});

// Fetch a session snapshot plus its full event log (for reconnects / deep links).
sessionsRouter.get("/:id", async (req, res) => {
  const session = await loadSession(req.params.id);
  if (!session) return res.status(404).json({ error: "session not found" });
  const events = await replayEvents(req.params.id);
  res.json({ session, events });
});

// Submit a learner answer in interactive mode; resumes the autonomous loop.
sessionsRouter.post("/:id/answer", async (req, res) => {
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "invalid request", details: parsed.error.flatten() });
  }
  const result = await submitAnswer(req.params.id, parsed.data.questionId, parsed.data.answer);
  if (!result.ok) return res.status(409).json({ error: result.reason });
  res.json({ ok: true });
});
