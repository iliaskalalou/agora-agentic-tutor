// ============================================================================
// Shared contract between the Node server (agents) and the React front-end.
// Keeping a single source of truth avoids drift between the autonomous loop
// and the control-room UI that visualizes it.
// ============================================================================

export type AgentKind =
  | "orchestrator"
  | "planner"
  | "tutor"
  | "assessor"
  | "diagnostician"
  | "learner";

export const AGENT_KINDS: AgentKind[] = [
  "orchestrator",
  "planner",
  "tutor",
  "assessor",
  "diagnostician",
  "learner",
];

export type Difficulty = "intro" | "core" | "advanced";

export type ConceptStatus =
  | "pending"
  | "teaching"
  | "assessing"
  | "mastered"
  | "remediating";

export interface Concept {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  status: ConceptStatus;
  /** Running mastery estimate in [0, 1]. */
  mastery: number;
  /** How many teach -> assess cycles this concept has gone through. */
  attempts: number;
  /** True when the diagnostician injected this concept mid-run as remediation. */
  injected: boolean;
  /** Optional id of the concept this remediation unblocks. */
  unblocks?: string;
}

export interface LearningPlan {
  goal: string;
  rationale: string;
  concepts: Concept[];
  createdAt: number;
}

export interface Lesson {
  conceptId: string;
  title: string;
  level: Difficulty;
  /** Short teaching body, plain text with line breaks. */
  body: string;
  keyPoints: string[];
  analogy?: string;
}

export type QuestionType = "mcq" | "open";

export interface Question {
  id: string;
  conceptId: string;
  type: QuestionType;
  prompt: string;
  choices?: string[];
  /** For MCQ grading (server-side only, also sent to power the autopilot learner). */
  correctIndex?: number;
  /** For open questions, keywords expected in a correct answer. */
  expectedKeywords?: string[];
  difficulty: Difficulty;
}

export interface AnswerEvaluation {
  questionId: string;
  conceptId: string;
  correct: boolean;
  /** Per-answer score in [0, 1]. */
  score: number;
  feedback: string;
  /** Identified misconception, when the answer reveals one. */
  misconception?: string;
  /** Prerequisite concept the learner appears to be missing, if any. */
  prerequisiteGap?: string;
}

export type NextAction =
  | "plan"
  | "teach"
  | "assess"
  | "await_answer"
  | "diagnose"
  | "remediate"
  | "advance"
  | "complete";

export type SessionStatus =
  | "idle"
  | "running"
  | "awaiting_input"
  | "completed"
  | "error";

export type SessionMode = "autopilot" | "interactive";

export type AvatarCreature = "fox" | "owl" | "robot" | "cat";

export interface AvatarConfig {
  creature: AvatarCreature;
  color: string;
}

export interface LearnerProfile {
  name: string;
  /** Simulated baseline competence in [0, 1] used by the autopilot learner. */
  simulatedSkill: number;
  /** Free-text interests used to personalize generated question scenarios. */
  interests: string[];
  /** The customized avatar that follows the learner across the app. */
  avatar: AvatarConfig;
}

export interface RunMetrics {
  lessonsDelivered: number;
  questionsAsked: number;
  correctAnswers: number;
  remediationsInjected: number;
  conceptsMastered: number;
  llmCalls: number;
  tokensApprox: number;
}

export interface SessionState {
  id: string;
  goal: string;
  mode: SessionMode;
  status: SessionStatus;
  llmProvider: string;
  plan: LearningPlan | null;
  currentConceptId: string | null;
  nextAction: NextAction;
  masteryAvg: number;
  stepCount: number;
  learner: LearnerProfile;
  pendingQuestions: Question[] | null;
  lastEvaluation: AnswerEvaluation | null;
  metrics: RunMetrics;
  summary: SessionSummary | null;
  createdAt: number;
  updatedAt: number;
}

export interface SessionSummary {
  goal: string;
  conceptsMastered: number;
  conceptsTotal: number;
  remediationsInjected: number;
  steps: number;
  durationMs: number;
  masteryAvg: number;
  headline: string;
}

// ---------------------------------------------------------------------------
// Real-time agent events streamed over SSE. The UI renders these as the
// "agent activity stream" — the visible proof of autonomous operation.
// ---------------------------------------------------------------------------

export type AgentEventType =
  | "phase"
  | "thinking"
  | "decision"
  | "plan.created"
  | "plan.updated"
  | "lesson"
  | "questions"
  | "awaiting-input"
  | "answer.received"
  | "evaluation"
  | "mastery.update"
  | "remediation"
  | "metrics"
  | "run.complete"
  | "error"
  | "snapshot";

export interface AgentEvent {
  id: string;
  sessionId: string;
  ts: number;
  agent: AgentKind;
  type: AgentEventType;
  title: string;
  detail?: string;
  /** Typed-but-flexible payload; consumers read the fields they expect. */
  data?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// HTTP API payloads.
// ---------------------------------------------------------------------------

export interface CreateSessionRequest {
  goal: string;
  mode?: SessionMode;
  learnerName?: string;
  simulatedSkill?: number;
  interests?: string[];
  avatar?: AvatarConfig;
}

export interface CreateSessionResponse {
  session: SessionState;
}

export interface AnswerRequest {
  questionId: string;
  /** Index for MCQ, free text for open questions. */
  answer: number | string;
}

export interface GoalPreset {
  id: string;
  title: string;
  goal: string;
  emoji: string;
  blurb: string;
}

export interface AggregateStats {
  sessionsStarted: number;
  conceptsMastered: number;
  lessonsDelivered: number;
  remediationsInjected: number;
}

// ---------------------------------------------------------------------------
// Document review: a learner uploads a photo of their work, OCR extracts the
// text, and a reviewer agent corrects it against the current concept.
// ---------------------------------------------------------------------------

export interface DocumentReview {
  extractedText: string;
  verdict: string;
  strengths: string[];
  corrections: string[];
  conceptTitle?: string;
  ocrOk: boolean;
}

export interface UploadResponse {
  review: DocumentReview;
}
