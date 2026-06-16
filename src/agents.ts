import type { AgentKind } from "../shared/types";

// Presentation metadata for each agent. Used only in the optional advanced
// ("coach") view; the default student experience hides agent internals.
export interface AgentMeta {
  kind: AgentKind;
  name: string;
  glyph: string;
  role: string;
  hex: string;
}

export const AGENT_META: Record<AgentKind, AgentMeta> = {
  orchestrator: { kind: "orchestrator", name: "Orchestrator", glyph: "O", role: "Decides the next move", hex: "#7c3aed" },
  planner: { kind: "planner", name: "Planner", glyph: "P", role: "Designs the learning path", hex: "#4f46e5" },
  tutor: { kind: "tutor", name: "Tutor", glyph: "T", role: "Teaches each concept", hex: "#059669" },
  assessor: { kind: "assessor", name: "Assessor", glyph: "A", role: "Checks understanding", hex: "#d97706" },
  diagnostician: { kind: "diagnostician", name: "Diagnostician", glyph: "D", role: "Finds gaps, corrects", hex: "#e11d48" },
  learner: { kind: "learner", name: "Learner", glyph: "L", role: "Answers and progresses", hex: "#0284c7" },
};

export const AGENT_ORDER: AgentKind[] = [
  "orchestrator",
  "planner",
  "tutor",
  "assessor",
  "diagnostician",
  "learner",
];
