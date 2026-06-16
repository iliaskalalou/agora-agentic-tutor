# Architecture

Agora is a multi-agent system whose behavior is an autonomous control loop. This document
describes the loop, the agents, the storage/eventing model, and the key decisions.

## The autonomous loop

The Orchestrator (`server/agents/orchestrator.ts`) is a state machine driven by
`session.nextAction`. Each step emits agent events (streamed to the UI) and persists state.

```
                ┌──────────────────────────────────────────────┐
                │                  PLAN                          │
                │  Planner decomposes goal → ordered concepts    │
                └───────────────┬──────────────────────────────┘
                                ▼
        ┌────────────►  TEACH  (Tutor)  ──────────────┐
        │                                              ▼
        │                                          ASSESS (Assessor)
        │                                              │
        │                       interactive ◄──────────┤──────────► autopilot
        │                  (wait for human answer)      │      (Learner answers)
        │                                              ▼
        │                                       DIAGNOSE (Diagnostician)
        │                                              │
        │              ┌───────────────┬───────────────┼───────────────┐
        │              ▼               ▼               ▼               ▼
        │          correct?        wrong + gap?    wrong, no gap    too many tries
        │              │           inject remedial   re-teach        force-advance
        │              ▼           micro-lesson       (deeper)        (partial)
        │           ADVANCE  ◄──────────┴───────────────┴───────────────┘
        │              │
        │     more concepts? ── yes ──┘ (back to TEACH)
        │              │
        │              no
        │              ▼
        └────────►  COMPLETE  (summary + certificate)
```

Key properties:

- **Bounded.** The outer loop is capped by `MAX_RUN_STEPS` (default 60, hard max 500). Each
  concept's `attempts` is capped at `MAX_ATTEMPTS = 3`, after which it force-advances with
  partial mastery. The loop provably converges.
- **Single-writer.** An in-process lock (`running` set) guarantees one logical step at a time
  per session, even across the interactive answer endpoint.
- **Emergent remediation.** On a wrong answer whose concept declares a misconception +
  prerequisite, the Orchestrator splices a remedial micro-lesson *before* the failed concept,
  re-points at it, and only returns to the original once the gap is closed. It injects at most
  once per concept (idempotent guard).

## Agents

Each agent is a small, single-responsibility module under `server/agents/`. Agents are
**LLM-augmented, not LLM-dependent**: the knowledge base (`server/domain/curriculum.ts`) is the
source of truth for structure and grading, while the LLM (when a key is present) enriches the
natural-language teaching prose and feedback. This keeps grading correct and the loop reliable
in every mode.

- `planner.ts` — `planLearningPath(goal)` → `{ plan, blueprint }`. The public `plan` is sent to
  the client; the server-only `blueprint` holds answers + remediation definitions.
- `tutor.ts` — `teach(concept, attempt)` → `Lesson`. Deepens level and body on re-teach.
- `assessor.ts` — `makeQuestion(concept, attempt)` → `Question`; `toPublicQuestion` strips
  answer keys before anything reaches the browser.
- `diagnostician.ts` — `evaluate(...)` → `AnswerEvaluation` with `correct`, `score`,
  `misconception`, `prerequisiteGap`.
- `learner.ts` — `answerAs(...)` → a deterministic simulated student (autopilot). It trips the
  misconception trap on first contact and succeeds after the tutor adapts — a repeatable,
  demo-safe learning curve.
- `llm.ts` — provider-agnostic `chat()` (Anthropic / OpenAI via `fetch`) returning `null` in
  simulation mode or on any error, so callers fall back to deterministic content.

## Storage & eventing

The `Store` interface (`server/redis.ts`) has two implementations selected at boot:

- **RedisStore** (ioredis) when `REDIS_URL` / `SCALINGO_REDIS_URL` is set and reachable.
- **MemoryStore** otherwise (or if Redis fails its boot ping) — demo-safe single-instance mode.

Redis usage is meaningful, not decorative:

| Concern | Mechanism |
|---|---|
| Session state | `agora:session:{id}` JSON (6h TTL) |
| Replayable event log | `agora:session:{id}:events` capped list (late SSE clients catch up) |
| Server-only answers | `agora:session:{id}:blueprint`, `:grading` (never sent to client) |
| Real-time fan-out | pub/sub on `agora:events:{id}` → every SSE connection, across instances |
| Analytics | `agora:stat:*` counters |

The front-end renders almost entirely from the event stream: a `snapshot` event carries the full
sanitized `SessionState` after every step, so the plan board, telemetry, and panels update
without polling; the other events drive the activity feed, lessons, and questions.

## Security

- **Answer keys never leave the server.** `correctIndex` / `expectedKeywords` live only in the
  blueprint and grading keys. `toPublicQuestion` strips them; `pendingQuestions` and the
  `snapshot` event only ever contain the sanitized question. An integration test asserts this.
- **Validated input.** All request bodies are Zod-validated; JSON bodies are capped at 128kb.
- **Rate limiting** on the run-spawning write paths; CORS disabled in production (same-origin UI).

## Notable decisions

- **`tsx` runtime, no server compile step** — minimizes buildpack failure modes; CI still
  typechecks with `tsc --noEmit`.
- **SSE + Redis pub/sub** over WebSockets — proxy-friendly and horizontally scalable.
- **Deterministic simulation as a first-class mode** — the demo is offline-safe and repeatable,
  which is exactly what you want on stage.
