import { chat } from "./llm";
import type { LearnerProfile, Question } from "../../shared/types";

// The Personalizer agent rewrites a verified exercise as a short adventure scene
// starring the learner's avatar and themed to their interests. CRUCIAL design
// choice: only the *narrative prompt* is generated; the answer choices and the
// correct index stay anchored to our verified knowledge base, so a local model
// can never produce a wrong correct answer. The question a learner reads is
// AI-generated and interest-targeted; the grading stays exact.

const SCENE_SYSTEM =
  "You are a game writer for a children's educational app. Write a vivid 2-3 sentence adventure scene that sets up a challenge for the learner's avatar, themed to their interests. Set the stakes (a gate to open, a path to find, a robot to fix...). Do NOT state the question, any numbers, or the answer — the exact question is added right after your scene. Keep it concise, upbeat and age-appropriate. Output only the scene text, no preamble.";

function sanitize(text: string): string {
  return text
    .replace(/```/g, "")
    .replace(/^\s*(scene|story|here.*?:)\s*/i, "")
    .trim()
    .slice(0, 600);
}

export async function personalizeQuestion(
  base: Question,
  conceptTitle: string,
  profile: LearnerProfile,
  scenario: string,
): Promise<Question> {
  const interests = profile.interests?.length ? profile.interests.join(", ") : "adventure";
  const hero = profile.name?.trim() || "the hero";

  const raw = await chat(
    SCENE_SYSTEM,
    [
      `Avatar: ${hero}, a brave ${profile.avatar.creature}.`,
      `The learner loves: ${interests}. Weave these interests into the scene.`,
      `Situation: ${hero} ${scenario}.`,
      `The challenge is about: ${conceptTitle}.`,
      `Write the setup scene now (no question, no numbers, no answer).`,
    ].join("\n"),
    220,
  );

  if (!raw) return base;
  const scene = sanitize(raw.text);
  if (scene.length < 25) return base;

  // Themed setup + the EXACT verified question. Choices + correctIndex stay
  // anchored to the knowledge base, so grading is never affected.
  return { ...base, prompt: `${scene}\n\n${base.prompt}` };
}
