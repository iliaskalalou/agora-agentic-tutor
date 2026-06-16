import type { AgentKind } from "../shared/types";

// Presentation metadata for each agent: its color (matches tailwind.config),
// glyph and one-line role. Drives the roster, badges and activity stream.
export interface AgentMeta {
  kind: AgentKind;
  name: string;
  glyph: string;
  role: string;
  hex: string;
}

export const AGENT_META: Record<AgentKind, AgentMeta> = {
  orchestrator: {
    kind: "orchestrator",
    name: "Orchestrator",
    glyph: "◎",
    role: "Decides the next move",
    hex: "#c084fc",
  },
  planner: {
    kind: "planner",
    name: "Planner",
    glyph: "✦",
    role: "Designs the learning path",
    hex: "#7c83ff",
  },
  tutor: {
    kind: "tutor",
    name: "Tutor",
    glyph: "❂",
    role: "Teaches each concept",
    hex: "#3ecf8e",
  },
  assessor: {
    kind: "assessor",
    name: "Assessor",
    glyph: "◈",
    role: "Checks understanding",
    hex: "#ffb020",
  },
  diagnostician: {
    kind: "diagnostician",
    name: "Diagnostician",
    glyph: "⚕",
    role: "Finds gaps, triggers remediation",
    hex: "#ff5d73",
  },
  learner: {
    kind: "learner",
    name: "Learner",
    glyph: "◍",
    role: "Answers and progresses",
    hex: "#22d3ee",
  },
};

export const AGENT_ORDER: AgentKind[] = [
  "orchestrator",
  "planner",
  "tutor",
  "assessor",
  "diagnostician",
  "learner",
];
