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

// School level (French system).
export type Cursus = "college" | "lycee";

// Grade levels within each cursus.
export const NIVEAUX: Record<Cursus, string[]> = {
  college: ["6e", "5e", "4e", "3e"],
  lycee: ["2nde", "1re", "Terminale"],
};

// Customizable humanoid avatar: hair (+ color), shirt, pants, shoes, skin tone.
export type HairStyle = "short" | "long" | "buzz" | "ponytail" | "curly" | "bald";

export interface AvatarConfig {
  skin: string;
  hair: HairStyle;
  hairColor: string;
  shirt: string;
  pants: string;
  shoes: string;
}

export interface LearnerProfile {
  name: string;
  /** Simulated baseline competence in [0, 1] used by the autopilot learner. */
  simulatedSkill: number;
  /** Free-text interests used to personalize generated question scenarios. */
  interests: string[];
  /** The customized avatar that follows the learner across the app. */
  avatar: AvatarConfig;
  /** School level, used to scope generated content. */
  cursus?: Cursus;
  /** Grade within the cursus (e.g. "4e", "Terminale"). */
  niveau?: string;
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
  cursus?: Cursus;
  niveau?: string;
  /** When practicing a specific curriculum category. */
  subjectId?: string;
  categoryId?: string;
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

// ---------------------------------------------------------------------------
// Curriculum tree: Cursus -> Subject -> Category. Drives the "browse by subject"
// navigation and scopes AI question generation to a program chapter.
// ---------------------------------------------------------------------------

export interface CurriculumCategory {
  id: string;
  name: string;
}

export interface CurriculumSubject {
  id: string;
  name: string;
  /** Hex accent color for the subject card. */
  color: string;
  categories: CurriculumCategory[];
}

export type CurriculumTree = Record<Cursus, CurriculumSubject[]>;

// ---------------------------------------------------------------------------
// Community layer (scaffolded — see ROADMAP.md). Lightweight accounts with no
// password: a userId is minted on profile creation and kept client-side.
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  cursus: Cursus;
  niveau?: string;
  interests: string[];
  avatar: AvatarConfig;
  xp: number;
  streak: number;
  friends: string[];
  createdAt: number;
}

export interface LeaderboardEntry {
  username: string;
  displayName: string;
  avatar: AvatarConfig;
  xp: number;
}

// ---------------------------------------------------------------------------
// Quiz: a ~20-question practice on a curriculum category. Questions are AI
// generated IN ENGLISH, strongly themed to the learner's interests, a mix of
// MCQ and open questions. They are generated in batches and revealed
// progressively. Open answers are graded by the AI.
// ---------------------------------------------------------------------------

export interface QuizAnswerRecord {
  questionId: string;
  correct: boolean;
  score: number;
  feedback: string;
}

export interface QuizState {
  id: string;
  cursus: Cursus;
  niveau?: string;
  subjectId: string;
  categoryId: string;
  subjectLabel: string;
  categoryLabel: string;
  /** Target number of questions (e.g. 20). */
  total: number;
  /** Public questions (answer keys stripped). Grows as batches are generated. */
  questions: Question[];
  /** True while more questions are still being generated in the background. */
  generating: boolean;
  currentIndex: number;
  answers: QuizAnswerRecord[];
  /** Number of correct answers so far. */
  score: number;
  status: "active" | "completed";
  createdAt: number;
}

export interface CreateQuizRequest {
  cursus: Cursus;
  niveau?: string;
  subjectId: string;
  categoryId: string;
  subjectLabel: string;
  categoryLabel: string;
  interests: string[];
}

export interface QuizAnswerResponse {
  correct: boolean;
  score: number;
  feedback: string;
  /** For open questions: a short ideal answer, shown after grading. */
  expected?: string;
  /** True when this was the last question and the quiz is complete. */
  done: boolean;
}
