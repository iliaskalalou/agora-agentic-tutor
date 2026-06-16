import { chat } from "./llm";
import type { Difficulty, Lesson } from "../../shared/types";
import type { KBConcept } from "../domain/curriculum";

const TUTOR_SYSTEM =
  "You are Agora's Tutor agent, an expert teacher. Explain one concept to a motivated beginner in 110-150 words of clear plain text. No markdown headers, no preamble. Stay strictly consistent with the provided ground truth.";

function deepen(d: Difficulty): Difficulty {
  if (d === "intro") return "core";
  if (d === "core") return "advanced";
  return "advanced";
}

// The Tutor agent produces a lesson. On a re-teach (attempt > 0) it deepens the
// level and uses the richer body — adapting its explanation to a learner who
// struggled, which is the visible adaptivity the rubric rewards.
export async function teach(kb: KBConcept, attempt: number): Promise<Lesson> {
  const level: Difficulty = attempt === 0 ? kb.difficulty : deepen(kb.difficulty);
  let body = attempt >= 1 ? kb.deeperBody : kb.summary;

  const raw = await chat(
    TUTOR_SYSTEM,
    [
      `Concept: ${kb.title}`,
      attempt > 0
        ? "The learner struggled with this once. Re-teach it more concretely and address the likely confusion."
        : "The learner is seeing this for the first time.",
      `Ground truth (stay consistent): ${kb.summary} ${kb.deeperBody}`,
      `Helpful analogy you may reuse: ${kb.analogy}`,
      "Write the explanation now.",
    ].join("\n"),
    400,
  );
  if (raw && raw.text.trim().length > 40) body = raw.text.trim();

  return {
    conceptId: kb.key,
    title: kb.title,
    level,
    body,
    keyPoints: kb.keyPoints,
    analogy: kb.analogy,
  };
}
