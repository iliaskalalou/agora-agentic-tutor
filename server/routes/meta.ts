import { Router } from "express";
import { GOAL_PRESETS } from "../domain/presets";
import { CURRICULUM } from "../domain/curriculumTree";
import { readStat } from "../store/sessionStore";
import type { AggregateStats } from "../../shared/types";

export const metaRouter = Router();

metaRouter.get("/presets", (_req, res) => {
  res.json({ presets: GOAL_PRESETS });
});

// The full curriculum tree (cursus -> subject -> category) for browse navigation.
metaRouter.get("/curriculum", (_req, res) => {
  res.json({ curriculum: CURRICULUM });
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
