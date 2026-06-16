import type { GoalPreset } from "../../shared/types";

// Curated demo subjects. Any free-text goal also works (generic builder + LLM).
// `subject` is shown as a small category tag; `emoji` is retained for API
// compatibility but no longer rendered by the professional UI.
export const GOAL_PRESETS: GoalPreset[] = [
  { id: "recursion", title: "Recursion", goal: "Understand recursion", emoji: "", blurb: "Call stacks, base cases, and tracing — the classic CS hurdle." },
  { id: "fractions", title: "Adding fractions", goal: "Master adding fractions", emoji: "", blurb: "Numerators, denominators, and why 1/2 + 1/3 is not 2/5." },
  { id: "percentages", title: "Percentages", goal: "Understand percentages and ratios", emoji: "", blurb: "Percent of a number, increases, and the right base." },
  { id: "algebra", title: "Basic algebra", goal: "Learn to solve linear equations", emoji: "", blurb: "Isolating x and undoing operations in the right order." },
  { id: "grammar", title: "English tenses", goal: "Understand English verb tenses", emoji: "", blurb: "Past, present perfect, and when each one fits." },
  { id: "geography", title: "World geography", goal: "Learn world geography basics", emoji: "", blurb: "Continents, capitals, and oceans." },
  { id: "chemistry", title: "Atoms & molecules", goal: "Understand atoms and molecules", emoji: "", blurb: "Elements, atoms, and how molecules form." },
  { id: "photosynthesis", title: "Photosynthesis", goal: "Understand photosynthesis", emoji: "", blurb: "Inputs, outputs, and where a plant's mass comes from." },
];
