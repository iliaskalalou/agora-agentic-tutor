# Slide content (source of truth)

Plain-text version of `docs/pitch.html`, ready to paste into PowerPoint / Google Slides.

## 1 — Title
**Agora — The Self-Driving Classroom**
Autonomous multi-agent tutoring. Agentic AI in Education hackathon.

## 2 — The problem
One-to-one tutoring works (Bloom's 2-sigma effect) but doesn't scale.
There will never be enough expert tutors. Every learner deserves one.

## 3 — The insight
Tutoring is a **loop**, not Q&A:
plan → teach → assess → **diagnose** → adapt → repeat.
Most "AI tutors" only do the "answer a question" part.

## 4 — The solution
Six autonomous agents that run the whole loop, to a goal, with little to no human input.
One input — a learning goal. Everything else is decided by the system.

## 5 — The crew
- Orchestrator — decides the next move
- Planner — designs the learning path
- Tutor — teaches each concept, adapts on re-teach
- Assessor — checks understanding
- Diagnostician — finds the gap, triggers remediation
- Learner — (autopilot) answers and closes the loop

## 6 — Emergent remediation (the headline)
Wrong answer → Diagnostician names the misconception → finds the missing prerequisite →
Orchestrator **rewrites its own plan**, injects a remedial lesson, then returns to the blocked
concept. Nobody scripted it.

## 7 — Live demo
Autopilot run of "Understand recursion" → watch the plan, the agents, the live decisions, and the
auto-added remediation. Then an interactive run with a human answering.

## 8 — Engineering
- Node + Express (tsx) · React control room · Redis (state, replayable events, pub/sub, analytics)
- Real-time via SSE + Redis pub/sub (scales across containers)
- Provider-agnostic LLM (Anthropic / OpenAI) → degrades to a deterministic engine
- **Demo-safe**: no API key, no network needed. Deploys to Scalingo in one command.

## 9 — Why it scores
Autonomy (closed multi-step loop) · Innovation (multi-agent + self-rewriting plans) ·
Impact (scalable 1:1 tutoring) · Theme (agentic by design) · Quality (typed, tested, verified).

## 10 — Close
Autonomous, adaptive tutoring for every learner.
Built by an agentic workflow — agents writing, reviewing, and verifying the code.
