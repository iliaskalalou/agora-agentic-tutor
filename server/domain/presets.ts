import type { GoalPreset } from "../../shared/types";

// Curated demo goals. The first four map to richly authored seed topics; any
// free-text goal also works via the generic builder (and a live LLM if set).
export const GOAL_PRESETS: GoalPreset[] = [
  {
    id: "recursion",
    title: "Recursion",
    goal: "Understand recursion",
    emoji: "🔁",
    blurb: "Call stack, base cases, and tracing — the classic CS stumbling block.",
  },
  {
    id: "fractions",
    title: "Adding fractions",
    goal: "Master adding fractions",
    emoji: "➗",
    blurb: "Numerators, denominators, and why 1/2 + 1/3 is not 2/5.",
  },
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    goal: "Understand photosynthesis",
    emoji: "🌿",
    blurb: "Inputs, outputs, and where a tree's mass really comes from.",
  },
  {
    id: "french-revolution",
    title: "French Revolution",
    goal: "Understand the French Revolution",
    emoji: "🏛️",
    blurb: "From fiscal crisis to the Declaration of Rights.",
  },
];
