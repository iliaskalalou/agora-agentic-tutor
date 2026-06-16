import { chat } from "./llm";
import type { AnswerEvaluation, Question } from "../../shared/types";
import type { KBConcept } from "../domain/curriculum";

const DIAG_SYSTEM =
  "You are Agora's Diagnostician agent. In 1-2 sentences, give warm, specific feedback on a learner's answer. Plain text only.";

// Deterministic grading. MCQ is exact; open answers score by keyword coverage.
function grade(question: Question, answer: number | string): { correct: boolean; score: number } {
  if (question.type === "mcq") {
    const idx = typeof answer === "number" ? answer : Number.parseInt(String(answer), 10);
    const correct = idx === question.correctIndex;
    return { correct, score: correct ? 1 : 0 };
  }
  const text = String(answer).toLowerCase();
  const kws = question.expectedKeywords ?? [];
  if (kws.length === 0) {
    const score = text.trim().length > 20 ? 0.6 : 0.2;
    return { correct: score >= 0.5, score };
  }
  const hits = kws.filter((k) => text.includes(k.toLowerCase())).length;
  const score = hits / kws.length;
  return { correct: score >= 0.5, score };
}

// The Diagnostician agent grades the answer and, crucially, names the
// misconception and prerequisite gap when the learner is wrong. The orchestrator
// uses those signals to decide whether to remediate, re-teach, or advance.
export async function evaluate(
  kb: KBConcept,
  question: Question,
  answer: number | string,
): Promise<AnswerEvaluation> {
  const { correct, score } = grade(question, answer);

  let feedback = correct
    ? `Correct. Your grasp of "${kb.title}" looks solid.`
    : `Not quite. Remember: ${kb.summary}`;

  const raw = await chat(
    DIAG_SYSTEM,
    [
      `Concept: ${kb.title}`,
      `Question: ${question.prompt}`,
      `Learner answered: ${typeof answer === "number" ? question.choices?.[answer] ?? answer : answer}`,
      `This answer is ${correct ? "correct" : "incorrect"}.`,
      correct ? "Reinforce why it is right." : `Gently correct it. Ground truth: ${kb.summary}`,
    ].join("\n"),
    200,
  );
  if (raw && raw.text.trim().length > 10) feedback = raw.text.trim();

  return {
    questionId: question.id,
    conceptId: kb.key,
    correct,
    score,
    feedback,
    misconception: correct ? undefined : kb.misconception,
    prerequisiteGap: correct ? undefined : kb.prerequisiteGap,
  };
}
