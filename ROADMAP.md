# Roadmap

Status of the build and where to help. New contributors: start with a **good first issue**.

## Done

- Learner profiles with a customizable humanoid avatar (hair, skin, t-shirt, pants, shoes) that
  follows the learner across the app.
- Cursus (collège / lycée) and interests on the profile.
- Curriculum tree: cursus → subject → category (French program), served at `GET /api/curriculum`.
- **Browse a subject → pick a category → the AI generates a practice path** for it
  (`server/agents/categoryPlanner.ts`, local Ollama, correct answer matched by text → exact grading).
- Autonomous tutoring loop (plan → teach → assess → diagnose → emergent remediation) — interactive
  and autopilot-demo modes.
- AI-generated, interest-themed exercise scenes for seed topics (local Ollama, keyless).
- "Correct my work": photo upload → OCR (Tesseract) → targeted feedback.
- Coach view toggle to reveal the agents; clean student view by default.
- Tests (typecheck + vitest + smoke), CI, Scalingo deploy scripts.

## Scaffolded — ready to build on

- **Community backend** (`server/community/users.ts`, `server/routes/community.ts`): lightweight,
  password-less accounts, friends, XP, and a naive leaderboard. Endpoints exist; **the friends UI
  is not built yet**.

## Planned

- **Friends UI** — profile page, add-a-friend by username, friends list, friends leaderboard
  (backend endpoints already exist). _good first issue_
- **Daily challenge** — a set of 20 mixed MCQ + open questions generated per day across subjects,
  cached per user per day in Redis. _good first issue_ (generation util pattern: see `categoryPlanner.ts`)
- **XP, levels & streaks on the UI** — surface `awardXp` results, a level curve, a daily streak.
- **Open-ended questions in generated practice** — `categoryPlanner` currently emits MCQ only;
  add open questions (graded by keyword/LLM, see `diagnostician.ts`). _good first issue_
- **Full French localization (i18n)** — the seed content and agent prompts are English; generated
  category content is already French. Unify language by cursus/locale. _good first issue_
- **Real accounts & persistence** — replace the password-less id with auth (e.g. magic link) and a
  Postgres store behind the existing `Store` interface.
- **Reliability of generated answers** — `categoryPlanner` matches the answer text to a choice; add
  a second-pass verification or a stronger model for higher accuracy.
- **Tighten ESLint** — add an `eslint.config.js` (typescript-eslint + react-hooks) and a `lint`
  script wired into CI. _good first issue_

## Good first issues (summary)

1. Build the Friends page against the existing `/api/community` endpoints.
2. Add the daily 20-question challenge (backend util + a home card).
3. Add open-ended questions to generated category practice.
4. Add ESLint config + script.
5. French i18n pass on seed content and agent prompts.
