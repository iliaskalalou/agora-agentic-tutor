import { Router } from "express";
import { GOAL_PRESETS } from "../domain/presets";
import { readStat } from "../store/sessionStore";
import type { AggregateStats } from "../../shared/types";

export const metaRouter = Router();

metaRouter.get("/presets", (_req, res) => {
  res.json({ presets: GOAL_PRESETS });
});

// Global counters, demonstrating Redis-backed analytics across sessions.
metaRouter.get("/stats", async (_req, res) => {
  const stats: AggregateStats = {
    sessionsStarted: await readStat("sessions_started"),
    conceptsMastered: await readStat("concepts_mastered"),
    lessonsDelivered: await readStat("lessons_delivered"),
    remediationsInjected: await readStat("remediations_injected"),
  };
  res.json({ stats });
});
