import { Router } from "express";
import { getStore } from "../redis";
import { providerName, isLive } from "../agents/llm";
import { config } from "../config";

export const healthRouter = Router();

const startedAt = Date.now();

// Liveness: cheap, always 200 if the process is up.
healthRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", uptimeMs: Date.now() - startedAt, version: "1.0.0" });
});

// Readiness: verifies the store (Redis or fallback) actually responds.
healthRouter.get("/ready", async (_req, res) => {
  const store = getStore();
  const ok = await store.ping();
  res.status(ok ? 200 : 503).json({
    ready: ok,
    backend: store.backend,
    redis: store.backend === "redis" && ok,
  });
});

// Surface runtime configuration the UI needs (provider + storage badges).
healthRouter.get("/info", (_req, res) => {
  res.json({
    provider: providerName(),
    llmLive: isLive(),
    storeBackend: getStore().backend,
    maxRunSteps: config.maxRunSteps,
  });
});
