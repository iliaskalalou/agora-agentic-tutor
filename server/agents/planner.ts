import { selectTopic } from "../domain/curriculum";
import type { KBConcept, KBTopic } from "../domain/curriculum";
import type { Concept, LearningPlan } from "../../shared/types";
import type { Blueprint } from "./types";

// The Planner agent decomposes a free-text goal into an ordered concept graph.
// It plans from the knowledge base so the autonomous loop always has gradeable
// material; a live LLM (when configured) enriches the teaching prose downstream.
function toPublicConcept(kb: KBConcept): Concept {
  return {
    id: kb.key,
    title: kb.title,
    summary: kb.summary,
    difficulty: kb.difficulty,
    status: "pending",
    mastery: 0,
    attempts: 0,
    injected: false,
  };
}

// Map any knowledge-base topic (seed or generated) into the public plan + the
// server-only blueprint the orchestrator runs on.
export function planFromTopic(goal: string, topic: KBTopic): { plan: LearningPlan; blueprint: Blueprint } {
  const plan: LearningPlan = {
    goal,
    rationale: topic.rationale,
    concepts: topic.concepts.map(toPublicConcept),
    createdAt: Date.now(),
  };
  const blueprint: Blueprint = {
    topicId: topic.id,
    goalTitle: topic.goalTitle,
    rationale: topic.rationale,
    concepts: topic.concepts,
  };
  return { plan, blueprint };
}

export function planLearningPath(goal: string): { plan: LearningPlan; blueprint: Blueprint } {
  return planFromTopic(goal, selectTopic(goal));
}
