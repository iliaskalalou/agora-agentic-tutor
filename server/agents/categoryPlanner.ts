import { z } from "zod";
import { chat } from "./llm";
import { buildGenericTopic } from "../domain/curriculum";
import type { KBConcept, KBTopic } from "../domain/curriculum";
import { findSubject, findCategoryName } from "../domain/curriculumTree";
import type { Cursus, Difficulty } from "../../shared/types";

// The Curriculum Planner agent builds a fresh practice path for a chosen program
// category (e.g. Maths -> Géométrie) by generating it with the local LLM. Crucial
// reliability rule: the model returns the correct answer as TEXT, and we locate
// it inside the choices to derive the index — a small local model can shuffle an
// index, but matching the answer string keeps grading exact. Concepts whose
// answer can't be located are dropped; if nothing usable remains we fall back to
// the deterministic generic builder.

const GEN_SCHEMA = {
  type: "object",
  properties: {
    concepts: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          question: { type: "string" },
          choices: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 4 },
          answer: { type: "string" },
        },
        required: ["title", "summary", "question", "choices", "answer"],
      },
    },
  },
  required: ["concepts"],
};

const Parsed = z.object({
  concepts: z
    .array(
      z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        question: z.string().min(1),
        choices: z.array(z.string().min(1)).length(4),
        answer: z.string().min(1),
      }),
    )
    .min(1),
});

const SYSTEM =
  "You are a curriculum author. Generate exactly 3 progressive practice sub-skills for a school topic. Each has a short title, a one-sentence summary, ONE multiple-choice question with exactly 4 distinct choices, and the correct answer text (which MUST be exactly equal to one of the 4 choices). Keep everything factually correct and at the stated school level. Output only the JSON.";

function difficultyFor(i: number): Difficulty {
  return i === 0 ? "intro" : i === 1 ? "core" : "advanced";
}

export async function buildCategoryTopic(args: {
  cursus: Cursus;
  subjectId: string;
  categoryId: string;
  goal: string;
}): Promise<KBTopic> {
  const subject = findSubject(args.cursus, args.subjectId);
  const categoryName = findCategoryName(args.cursus, args.subjectId, args.categoryId);
  if (!subject || !categoryName) return buildGenericTopic(args.goal);

  const level = args.cursus === "college" ? "French middle-school (collège)" : "French high-school (lycée)";
  const raw = await chat(
    SYSTEM,
    `Subject: ${subject.name}. Topic/category: ${categoryName}. Level: ${level}. Generate the 3 sub-skills now.`,
    700,
    GEN_SCHEMA,
  );
  if (!raw) return buildGenericTopic(args.goal);

  try {
    const data = Parsed.parse(JSON.parse(raw.text));
    const concepts: KBConcept[] = [];
    data.concepts.slice(0, 3).forEach((c, i) => {
      const idx = c.choices.findIndex((ch) => ch.trim().toLowerCase() === c.answer.trim().toLowerCase());
      if (idx < 0) return; // answer not located among choices -> drop (keep grading exact)
      const points = c.summary
        .split(/[.;]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 3)
        .slice(0, 3);
      concepts.push({
        key: `gen${i}`,
        title: c.title.slice(0, 90),
        difficulty: difficultyFor(i),
        summary: c.summary.slice(0, 400),
        analogy: "",
        keyPoints: points.length ? points : [c.summary.slice(0, 120)],
        deeperBody: c.summary.slice(0, 400),
        questions: [
          {
            type: "mcq",
            prompt: c.question.slice(0, 300),
            choices: c.choices.map((ch) => ch.slice(0, 120)),
            correctIndex: idx,
            difficulty: difficultyFor(i),
          },
        ],
      });
    });

    if (concepts.length === 0) return buildGenericTopic(args.goal);

    return {
      id: `cat:${args.subjectId}:${args.categoryId}`,
      match: [],
      goalTitle: `${categoryName} — ${subject.name}`,
      rationale: `A short, AI-generated practice path on ${categoryName} (${subject.name}, ${level}).`,
      concepts,
    };
  } catch {
    return buildGenericTopic(args.goal);
  }
}
