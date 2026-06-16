import { describe, it, expect } from "vitest";
import { selectTopic, TOPICS } from "../server/domain/curriculum";
import { planLearningPath } from "../server/agents/planner";
import { makeQuestion } from "../server/agents/assessor";
import { answerAs } from "../server/agents/learner";
import { evaluate } from "../server/agents/diagnostician";

describe("curriculum routing", () => {
  it("routes a known goal to its seed topic", () => {
    expect(selectTopic("Understand recursion").id).toBe("recursion");
    expect(selectTopic("Master adding fractions").id).toBe("fractions");
  });

  it("falls back to a generic scaffold for unknown goals", () => {
    const topic = selectTopic("learn quantum chromodynamics");
    expect(topic.id).toBe("generic");
    expect(topic.concepts.length).toBeGreaterThanOrEqual(3);
  });
});

describe("planner", () => {
  it("produces a fresh, unstarted concept graph", () => {
    const { plan, blueprint } = planLearningPath("Understand recursion");
    expect(plan.concepts.length).toBe(blueprint.concepts.length);
    expect(plan.concepts.every((c) => c.status === "pending" && c.mastery === 0)).toBe(true);
  });
});

describe("simulated learner is deterministic and adaptive", () => {
  const recursion = TOPICS.find((t) => t.id === "recursion")!;
  const baseCase = recursion.concepts.find((c) => c.key === "base-case")!;

  it("trips the misconception trap on first contact", () => {
    const q = makeQuestion(baseCase, 0);
    const decision = answerAs(baseCase, q, 0.7, 0);
    expect(decision.answer).not.toBe(q.correctIndex);
  });

  it("answers correctly after the concept is re-taught", () => {
    const q = makeQuestion(baseCase, 1);
    const decision = answerAs(baseCase, q, 0.7, 1);
    expect(decision.answer).toBe(q.correctIndex);
  });
});

describe("diagnostician grading", () => {
  const recursion = TOPICS.find((t) => t.id === "recursion")!;
  const baseCase = recursion.concepts.find((c) => c.key === "base-case")!;

  it("marks the correct MCQ answer correct", async () => {
    const q = makeQuestion(baseCase, 0);
    const result = await evaluate(baseCase, q, q.correctIndex!);
    expect(result.correct).toBe(true);
    expect(result.score).toBe(1);
  });

  it("flags a misconception on a wrong answer", async () => {
    const q = makeQuestion(baseCase, 0);
    const wrong = (q.correctIndex! + 1) % (q.choices?.length ?? 2);
    const result = await evaluate(baseCase, q, wrong);
    expect(result.correct).toBe(false);
    expect(result.misconception).toBeTruthy();
  });
});
