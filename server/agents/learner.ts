import type { Question } from "../../shared/types";
import type { KBConcept } from "../domain/curriculum";

// The Learner agent is a simulated student used in autopilot mode, so the whole
// loop can run end-to-end with zero human input — the strongest demonstration of
// autonomous operation. Its behavior is deterministic (no RNG) so demos and
// tests are perfectly repeatable: a struggling learner trips the misconception
// trap on first contact, then succeeds once the tutor adapts.
export interface LearnerDecision {
  answer: number | string;
  rationale: string;
  confident: boolean;
}

export function answerAs(
  kb: KBConcept,
  question: Question,
  skill: number,
  attempt: number,
): LearnerDecision {
  let competence = skill;
  if (attempt >= 1) competence += 0.4; // re-teaching / remediation helps
  if (kb.difficulty === "advanced") competence -= 0.25;
  else if (kb.difficulty === "core") competence -= 0.1;

  const isTrap = Boolean(kb.misconception);
  // First contact with a misconception trap: a non-expert learner falls for it.
  const knows = isTrap && attempt === 0 && skill < 0.85 ? false : competence >= 0.5;

  if (question.type === "mcq") {
    const correctIndex = question.correctIndex ?? 0;
    if (knows) {
      return {
        answer: correctIndex,
        confident: competence > 0.75,
        rationale: `This matches what the tutor just explained about ${kb.title.toLowerCase()}.`,
      };
    }
    // Pick a plausible wrong option deterministically.
    const wrong = question.choices
      ? question.choices.findIndex((_, i) => i !== correctIndex)
      : (correctIndex + 1) % 4;
    return {
      answer: wrong < 0 ? (correctIndex + 1) % (question.choices?.length ?? 2) : wrong,
      confident: false,
      rationale: isTrap
        ? `I think the intuitive answer is right here — though I'm not fully sure.`
        : `I'm guessing; this one is harder than it looks.`,
    };
  }

  // Open question.
  if (knows) {
    const kws = question.expectedKeywords ?? kb.keyPoints;
    return {
      answer: `${kb.title}: ${kws.slice(0, 3).join(", ")}.`,
      confident: competence > 0.75,
      rationale: `Recalling the key points the tutor emphasized.`,
    };
  }
  return {
    answer: `I think it has to do with ${kb.title.toLowerCase()}, but I'm unsure of the details.`,
    confident: false,
    rationale: `Only a vague memory of this one.`,
  };
}
