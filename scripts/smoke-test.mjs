#!/usr/bin/env node
// End-to-end smoke test against a running Agora server. Drives a full autonomous
// run and asserts the agents planned, taught, remediated and completed the goal.
// Usage: SMOKE_URL=https://your-app.osc-fr1.scalingo.io node scripts/smoke-test.mjs
//        (defaults to http://localhost:$PORT)

const BASE = process.env.SMOKE_URL || `http://localhost:${process.env.PORT || 3000}`;
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 45000);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;

function check(name, ok, extra = "") {
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? ` — ${extra}` : ""}`);
  if (!ok) failures++;
}

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

async function main() {
  console.log(`\n▶ Agora smoke test against ${BASE}\n`);

  const health = await getJson("/api/health");
  check("health endpoint", health.status === "ok");

  const ready = await getJson("/api/ready");
  check("readiness", ready.ready === true, `store=${ready.backend}`);

  const info = await getJson("/api/info");
  check("runtime info", typeof info.provider === "string", `llm=${info.provider}, store=${info.storeBackend}`);

  const created = await fetch(`${BASE}/api/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ goal: "Understand recursion", mode: "autopilot", simulatedSkill: 0.7 }),
  }).then((r) => r.json());
  const id = created.session?.id;
  check("session created", Boolean(id), `concepts=${created.session?.plan?.concepts?.length}`);
  if (!id) throw new Error("no session id");

  const deadline = Date.now() + TIMEOUT_MS;
  let session = created.session;
  while (Date.now() < deadline) {
    const snap = await getJson(`/api/sessions/${id}`);
    session = snap.session;
    if (session.status === "completed" || session.status === "error") break;
    await sleep(400);
  }

  check("run completed autonomously", session.status === "completed", `status=${session.status}, steps=${session.stepCount}`);
  check(
    "all concepts mastered",
    session.summary && session.summary.conceptsMastered === session.summary.conceptsTotal,
    `${session.summary?.conceptsMastered}/${session.summary?.conceptsTotal}`,
  );
  check(
    "emergent remediation occurred",
    session.metrics.remediationsInjected >= 1,
    `remediations=${session.metrics.remediationsInjected}`,
  );
  check("lessons delivered", session.metrics.lessonsDelivered > 0, `lessons=${session.metrics.lessonsDelivered}`);

  console.log(`\n${failures === 0 ? "🎉 All smoke checks passed." : `💥 ${failures} check(s) failed.`}\n`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Smoke test crashed:", err.message);
  process.exit(1);
});
