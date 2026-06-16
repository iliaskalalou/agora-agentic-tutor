import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { createApp } from "../server/index";

let app: Express;

beforeAll(async () => {
  app = await createApp();
});

// Regression: the rate limiter must only throttle writes. Read polling
// (GET /api/sessions/:id) must never be limited, or the client/smoke test break.
describe("rate limiting", () => {
  it("does not throttle repeated GET polling", async () => {
    const create = await request(app)
      .post("/api/sessions")
      .send({ goal: "Understand recursion", mode: "autopilot" });
    const id = create.body.session.id as string;

    const results = await Promise.all(
      Array.from({ length: 60 }, () => request(app).get(`/api/sessions/${id}`)),
    );
    expect(results.every((r) => r.status === 200)).toBe(true);
  });
});
