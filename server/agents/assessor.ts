import { nanoid } from "nanoid";
import type { Question } from "../../shared/types";
import type { KBConcept, KBQuestion } from "../domain/curriculum";

// The Assessor agent turns a concept into a single gradeable question. Keeping
// one question per round makes the interactive flow crisp and the autopilot
// loop easy to follow on screen.
function materialize(conceptId: string, q: KBQuestion): Question {
  return {
    id: nanoid(8),
    conceptId,
    type: q.type,
    prompt: q.prompt,
    choices: q.choices,
    correctIndex: q.correctIndex,
    expectedKeywords: q.expectedKeywords,
    difficulty: q.difficulty,
  };
}

export function makeQuestion(kb: KBConcept, attempt: number): Question {
  const idx = Math.min(attempt, kb.questions.length - 1);
  const q = kb.questions[idx] ?? kb.questions[0];
  return materialize(kb.key, q);
}

// Strip answer keys before a question is sent to the browser.
export function toPublicQuestion(q: Question): Question {
  const { correctIndex: _c, expectedKeywords: _k, ...rest } = q;
  return rest;
}
