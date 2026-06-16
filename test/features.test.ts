import { describe, it, expect } from "vitest";
import { selectTopic } from "../server/domain/curriculum";
import { EXTRA_TOPICS } from "../server/domain/exercises_extra";
import { reviewDocument } from "../server/agents/reviewer";

describe("expanded exercise bank", () => {
  it("adds six new subject areas", () => {
    expect(EXTRA_TOPICS.length).toBe(6);
    for (const t of EXTRA_TOPICS) {
      expect(t.concepts.length).toBeGreaterThanOrEqual(4);
      // Every concept ships multiple practice questions.
      expect(t.concepts.every((c) => c.questions.length >= 3)).toBe(true);
      // Exactly one concept carries a misconception trap + remediation.
      const traps = t.concepts.filter((c) => c.misconception && c.remediation);
      expect(traps.length).toBe(1);
    }
  });

  it("routes new goals to the right subject", () => {
    expect(selectTopic("Understand percentages and ratios").id).toBe("percentages");
    expect(selectTopic("Learn to solve linear equations").id).toBe("algebra");
    expect(selectTopic("world geography basics").id).toBe("geography");
  });

  it("every MCQ has a valid correct answer index", () => {
    for (const t of EXTRA_TOPICS) {
      for (const c of t.concepts) {
        for (const q of c.questions) {
          if (q.type === "mcq") {
            expect(q.choices && q.choices.length).toBeGreaterThanOrEqual(2);
            expect(q.correctIndex).toBeGreaterThanOrEqual(0);
            expect(q.correctIndex!).toBeLessThan(q.choices!.length);
          }
        }
      }
    }
  });
});

describe("document reviewer (OCR correction)", () => {
  it("guides the learner when OCR fails to read the image", async () => {
    const review = await reviewDocument("", false, "Adding fractions", ["common denominator"]);
    expect(review.ocrOk).toBe(false);
    expect(review.corrections.length).toBeGreaterThan(0);
  });

  it("acknowledges covered key points and flags missing ones", async () => {
    const review = await reviewDocument(
      "To add the fractions I found a common denominator of 6 and then added the numerators.",
      true,
      "Adding fractions",
      ["Find a common denominator", "Add the numerators", "Simplify the result"],
    );
    expect(review.ocrOk).toBe(true);
    expect(review.extractedText.length).toBeGreaterThan(0);
    expect(review.strengths.length + review.corrections.length).toBeGreaterThan(0);
  });
});
