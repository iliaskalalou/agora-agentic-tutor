import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../server/index";
import type { AgentEvent, SessionState } from "../shared/types";

let app: Express;

beforeAll(async () => {
  app = await createApp();
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function poll(
  id: string,
  predicate: (s: SessionState) => boolean,
  timeoutMs = 15_000,
): Promise<{ session: SessionState; events: AgentEvent[] }> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await request(app).get(`/api/sessions/${id}`);
    if (res.status === 200 && predicate(res.body.session)) return res.body;
    await sleep(40);
  }
  throw new Error("poll timed out");
}

describe("health & meta", () => {
  it("reports liveness and readiness", async () => {
    expect((await request(app).get("/api/health")).status).toBe(200);
    const ready = await request(app).get("/api/ready");
    expect(ready.status).toBe(200);
    expect(ready.body.ready).toBe(true);
  });

  it("exposes runtime info and presets", async () => {
    const info = await request(app).get("/api/info");
    expect(info.body.provider).toBe("simulation");
    expect(info.body.storeBackend).toBe("memory");
    const presets = await request(app).get("/api/presets");
    expect(presets.body.presets.length).toBeGreaterThanOrEqual(4);
  });
});

describe("autonomous autopilot run", () => {
  it("plans, teaches, remediates and completes the goal end-to-end", async () => {
    const create = await request(app)
      .post("/api/sessions")
      .send({ goal: "Understand recursion", mode: "autopilot", simulatedSkill: 0.7 });
    expect(create.status).toBe(201);
    const id = create.body.session.id as string;
    expect(create.body.session.plan.concepts.length).toBe(4);

    const { session, events } = await poll(id, (s) => s.status === "completed");

    // Goal achieved: every concept mastered.
    expect(session.summary).toBeTruthy();
    expect(session.summary!.conceptsMastered).toBe(session.summary!.conceptsTotal);
    // Emergent behavior: the orchestrator injected at least one remediation.
    expect(session.metrics.remediationsInjected).toBeGreaterThanOrEqual(1);
    expect(session.metrics.lessonsDelivered).toBeGreaterThan(0);

    const types = new Set(events.map((e) => e.type));
    expect(types.has("remediation")).toBe(true);
    expect(types.has("run.complete")).toBe(true);
    // A remediation concept was added to the plan beyond the original 4.
    expect(session.plan!.concepts.some((c) => c.injected)).toBe(true);
  });
});

describe("interactive run", () => {
  it("pauses for a human answer then accepts it", async () => {
    const create = await request(app)
      .post("/api/sessions")
      .send({ goal: "Master adding fractions", mode: "interactive" });
    const id = create.body.session.id as string;

    const { session } = await poll(id, (s) => s.status === "awaiting_input");
    expect(session.pendingQuestions).toBeTruthy();
    expect(session.pendingQuestions!.length).toBe(1);
    // Answer keys must never leak to the client.
    expect(session.pendingQuestions![0].correctIndex).toBeUndefined();

    const questionId = session.pendingQuestions![0].id;
    const answer = await request(app).post(`/api/sessions/${id}/answer`).send({ questionId, answer: 1 });
    expect(answer.status).toBe(200);
    expect(answer.body.ok).toBe(true);
  });
});
