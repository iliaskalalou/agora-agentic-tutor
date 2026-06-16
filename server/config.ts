import "dotenv/config";
import { z } from "zod";

// Validate the environment once at boot. Everything is optional so the app can
// run in a zero-config demo-safe mode, but we still coerce and bound values.
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  // Redis: Scalingo injects SCALINGO_REDIS_URL; we also accept REDIS_URL.
  REDIS_URL: z.string().optional(),
  SCALINGO_REDIS_URL: z.string().optional(),

  LLM_PROVIDER: z.enum(["auto", "anthropic", "openai", "simulation"]).default("auto"),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-opus-4-8"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o"),

  MAX_RUN_STEPS: z.coerce.number().int().positive().max(500).default(60),
});

const parsed = schema.parse(process.env);

const redisUrl = parsed.REDIS_URL || parsed.SCALINGO_REDIS_URL || null;

function resolveProvider(): "anthropic" | "openai" | "simulation" {
  if (parsed.LLM_PROVIDER === "anthropic") return "anthropic";
  if (parsed.LLM_PROVIDER === "openai") return "openai";
  if (parsed.LLM_PROVIDER === "simulation") return "simulation";
  // auto-detection
  if (parsed.ANTHROPIC_API_KEY) return "anthropic";
  if (parsed.OPENAI_API_KEY) return "openai";
  return "simulation";
}

export const config = {
  env: parsed.NODE_ENV,
  isProd: parsed.NODE_ENV === "production",
  port: parsed.PORT,
  redisUrl,
  hasRedis: Boolean(redisUrl),
  llm: {
    provider: resolveProvider(),
    anthropicKey: parsed.ANTHROPIC_API_KEY,
    anthropicModel: parsed.ANTHROPIC_MODEL,
    openaiKey: parsed.OPENAI_API_KEY,
    openaiModel: parsed.OPENAI_MODEL,
  },
  maxRunSteps: parsed.MAX_RUN_STEPS,
} as const;

export type AppConfig = typeof config;
