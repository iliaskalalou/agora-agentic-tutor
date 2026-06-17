# Contributing to Agora

Welcome! This guide gets you productive fast. Agora is an adaptive, agentic AI tutoring web app
for French collège/lycée students. Read this, then check [ROADMAP.md](ROADMAP.md) for tasks —
look for the **good first issue** label.

## Setup

```bash
npm install
npm run dev          # API on :3000, Vite UI on :5173
```

Zero config needed: the app runs with an in-memory store and a deterministic engine. For real
AI-generated, personalized exercises, run a local model (no API key, nothing to pay):

```bash
# install Ollama from https://ollama.com, then:
ollama pull llama3.2
LLM_PROVIDER=ollama npm run dev
```

Never commit API keys. `.env` is git-ignored; only Ollama (local, keyless) is used by default.

## Project structure

```
shared/types.ts        # The single source of truth shared by server + web. Start here.
server/
  index.ts             # Express bootstrap (createApp() is exported for tests)
  config.ts            # Zod-validated env
  redis.ts             # Store abstraction: Redis OR in-memory fallback (+ pub/sub)
  agents/              # The AI agents — one responsibility each
    orchestrator.ts    #   the autonomous loop (plan→teach→assess→diagnose→adapt)
    planner.ts         #   goal/topic → concept plan
    categoryPlanner.ts #   curriculum category → AI-generated practice path
    tutor.ts assessor.ts diagnostician.ts learner.ts questionGen.ts reviewer.ts
    llm.ts             #   provider-agnostic LLM (Anthropic / OpenAI / Ollama / simulation)
  domain/              # Content & data
    curriculum.ts      #   seed knowledge base (verified Q&A)
    curriculumTree.ts  #   French program: cursus → subject → category
    exercises_extra.ts #   extra seed subjects
    scenarios.ts       #   per-subject narrative flavor
  routes/              # HTTP endpoints (health, meta, sessions, events, upload)
  services/ocr.ts      # Tesseract OCR for "correct my work"
  community/           # Social layer (scaffold — see ROADMAP)
src/                   # React front-end (Vite + Tailwind)
  components/          # One component per file
test/                  # Vitest unit + integration tests
```

## Conventions

- **TypeScript everywhere, strict.** No `any`. Types live in `shared/types.ts` and are imported
  by both sides — never duplicate a type.
- **Agents are small and single-purpose.** A new capability is usually a new file in
  `server/agents/` plus a call from the orchestrator.
- **The LLM augments, it doesn't decide grades.** Answer keys are always anchored to verified data
  (KB or a matched answer string), never trusted blindly from a model. Keep it that way.
- **Demo-safe.** Every LLM call must degrade gracefully (`chat()` returns `null` → deterministic
  fallback). The app must always work with no model and no network.
- **Formatting:** run `npm run format` (Prettier). 2 spaces, double quotes, semicolons.
- **Commits:** conventional-ish (`feat:`, `fix:`, `docs:`, `chore:`). Small and focused.

## Before opening a PR

```bash
npm run typecheck    # tsc, web + server
npm test             # vitest
npm run build        # vite production build
npm run format       # prettier
```

CI runs typecheck + tests + build + a smoke test on every PR. Keep it green.

## How to…

- **Add a subject/category:** edit `server/domain/curriculumTree.ts` (keep ids stable).
- **Add an avatar option:** edit the option lists in `src/components/Avatar.tsx`.
- **Add an agent:** create `server/agents/<name>.ts`, wire it from `orchestrator.ts`, add a test.
- **Change the API contract:** edit `shared/types.ts` first, then server + web follow the types.
