// Per-subject narrative flavor. The question generator wraps each exercise in a
// short adventure scene starring the learner's avatar; this map gives every
// subject its own situation so "solve the exercise" becomes "advance the story".
export const SCENARIOS: Record<string, string> = {
  recursion: "is trapped in a hall of mirrors and must reason step by step to find the way out",
  fractions: "is locked in front of a heavy gate and must solve the calculation to open it",
  percentages: "is bargaining at a bustling market and must work out the price to get through",
  algebra: "faces a magic lock with a hidden number and must solve for it to pass",
  grammar: "must decode a guard's scrambled message to be allowed across the bridge",
  geography: "is lost on a great journey and must pick the right direction to continue",
  chemistry: "stands in an alchemist's lab and must combine the right answer to brew the potion",
  programming: "finds a stuck robot and must fix its logic to make it move forward",
  photosynthesis: "must help a wilting plant come back to life by answering correctly",
  "french-revolution": "is swept back in time and must make the right call to change history",
};

export const DEFAULT_SCENARIO = "reaches a challenge gate where a correct answer opens the way forward";

export function scenarioFor(topicId: string): string {
  return SCENARIOS[topicId] ?? DEFAULT_SCENARIO;
}
