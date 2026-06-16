import type { KBConcept } from "../domain/curriculum";

// Server-only blueprint: the full knowledge base for a run, including answers
// and remediation definitions. Persisted separately from the client-facing
// SessionState so correct answers never reach the browser.
export interface Blueprint {
  topicId: string;
  goalTitle: string;
  rationale: string;
  concepts: KBConcept[];
}
