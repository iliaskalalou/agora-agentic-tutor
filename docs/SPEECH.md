# Pitch speech (~2.5 minutes)

> Pair this with `docs/pitch.html` (the slide deck) and `docs/DEMO.md` (the live demo).

**Open.**
"In 1984, Benjamin Bloom measured something striking: students tutored one-to-one performed two
standard deviations better than students in a normal classroom. One-to-one tutoring is the most
effective intervention we have in education. It's also the least scalable — there will never be
enough expert tutors. That gap is the problem we attacked."

**The insight.**
"Most 'AI tutors' are just a chatbot answering questions. But real tutoring isn't question-answer.
A good tutor *plans* what to teach, *notices* confusion, *diagnoses the underlying gap*, and
*changes the plan* to fix it. It's a loop. So we built that loop — as a system of autonomous
agents."

**The solution.**
"Agora is six AI agents. A Planner decomposes a goal into a concept graph. A Tutor teaches. An
Assessor checks understanding. A Diagnostician grades and identifies the *misconception*. An
Orchestrator decides what happens next. And in autopilot, a simulated Learner answers — so the
entire session runs end-to-end with zero human input."

**The money moment.**
"Here's the behavior we're proud of. When the Diagnostician detects a mistake that traces to a
missing prerequisite, the Orchestrator *rewrites its own plan* — it injects a remedial lesson it
never originally planned, teaches it, then returns to the concept the learner was stuck on. Nobody
scripted that. It's a decision the system makes from the learner's state. That's emergent agentic
behavior, not a scripted flow."

**[Run the live demo here — see DEMO.md.]**

**The engineering.**
"Under the hood it's a production-shaped Node and Redis app. Real-time agent events stream over
SSE, fanned out through Redis pub/sub so it scales across containers. The LLM layer is
provider-agnostic — Anthropic or OpenAI — and, critically, it degrades to a deterministic
pedagogical engine. That means the demo you just saw needs no network and no API key at all. By
design, our demo cannot break on stage. It deploys to Scalingo in one command, with a Redis addon,
and it's tested end-to-end — unit, integration, smoke, and in a real browser."

**Impact and close.**
"Autonomous, adaptive tutoring that scales to every learner is one of the highest-impact things
agentic AI can do. Agora is a working step toward it. And fittingly — this project about agentic AI
was itself built by an agentic workflow: agents writing code, reviewing each other, and verifying
the result. Thank you."
