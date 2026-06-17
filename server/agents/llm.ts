import { config } from "../config";
import { logger } from "../logger";

// ---------------------------------------------------------------------------
// Provider-agnostic LLM access. Agents call `chat()`; when a provider key is
// configured it hits the real API and returns text, otherwise it returns null
// and the calling agent falls back to its deterministic generator. This is the
// design that makes Agora both genuinely generative (with a key) and perfectly
// demo-safe (without one — no network, no flakiness on stage).
// ---------------------------------------------------------------------------

export interface RawCompletion {
  text: string;
  tokensApprox: number;
  provider: string;
}

let llmCalls = 0;
let tokensApprox = 0;

export function getUsage() {
  return { llmCalls, tokensApprox };
}

export function providerName(): string {
  return config.llm.provider;
}

export function isLive(): boolean {
  return config.llm.provider !== "simulation";
}

const TIMEOUT_MS = 45_000; // generous: a local Ollama model can be slow to warm up

async function withTimeout(p: (signal: AbortSignal) => Promise<Response>): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await p(ctrl.signal);
  } finally {
    clearTimeout(timer);
  }
}

async function anthropicChat(system: string, prompt: string, maxTokens: number): Promise<RawCompletion> {
  const res = await withTimeout((signal) =>
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": config.llm.anthropicKey as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.llm.anthropicModel,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    }),
  );
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    content: { text: string }[];
    usage?: { input_tokens: number; output_tokens: number };
  };
  const text = json.content.map((c) => c.text).join("");
  const used = (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0);
  return { text, tokensApprox: used || Math.ceil((system.length + prompt.length + text.length) / 4), provider: "anthropic" };
}

async function openaiChat(system: string, prompt: string, maxTokens: number): Promise<RawCompletion> {
  const res = await withTimeout((signal) =>
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.llm.openaiKey}`,
      },
      body: JSON.stringify({
        model: config.llm.openaiModel,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
    }),
  );
  if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage?: { total_tokens: number };
  };
  const text = json.choices[0]?.message?.content ?? "";
  const used = json.usage?.total_tokens ?? Math.ceil((system.length + prompt.length + text.length) / 4);
  return { text, tokensApprox: used, provider: "openai" };
}

// Local, keyless LLM via Ollama. No API key is ever required or stored.
// An optional JSON schema constrains the output to valid, well-typed JSON.
async function ollamaChat(
  system: string,
  prompt: string,
  maxTokens: number,
  jsonSchema?: unknown,
): Promise<RawCompletion> {
  const res = await withTimeout((signal) =>
    fetch(`${config.llm.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: config.llm.ollamaModel,
        stream: false,
        ...(jsonSchema ? { format: jsonSchema } : {}),
        options: { temperature: jsonSchema ? 0.5 : 0.85, num_predict: maxTokens },
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      }),
    }),
  );
  if (!res.ok) throw new Error(`ollama ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as {
    message?: { content: string };
    prompt_eval_count?: number;
    eval_count?: number;
  };
  const text = json.message?.content ?? "";
  const used = (json.prompt_eval_count ?? 0) + (json.eval_count ?? 0);
  return {
    text,
    tokensApprox: used || Math.ceil((system.length + prompt.length + text.length) / 4),
    provider: "ollama",
  };
}

/**
 * Returns a completion, or null when running in simulation mode (so the caller
 * uses its deterministic generator). Any provider error also resolves to null:
 * we degrade gracefully rather than break the autonomous run.
 */
export async function chat(
  system: string,
  prompt: string,
  maxTokens = 900,
  jsonSchema?: unknown,
): Promise<RawCompletion | null> {
  const provider = config.llm.provider;
  if (provider === "simulation") return null;
  try {
    const result =
      provider === "anthropic"
        ? await anthropicChat(system, prompt, maxTokens)
        : provider === "ollama"
          ? await ollamaChat(system, prompt, maxTokens, jsonSchema)
          : await openaiChat(system, prompt, maxTokens);
    llmCalls += 1;
    tokensApprox += result.tokensApprox;
    return result;
  } catch (err) {
    logger.warn({ err: (err as Error).message, provider }, "LLM call failed; using deterministic fallback");
    return null;
  }
}

// Robustly pull the first JSON object/array out of a model response that may be
// wrapped in prose or markdown fences.
export function extractJson<T>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.search(/[[{]/);
  if (start === -1) throw new Error("no JSON found in completion");
  const slice = candidate.slice(start);
  // Walk to the matching closing bracket to tolerate trailing text.
  const open = slice[0];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = 0; i < slice.length; i++) {
    const ch = slice[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return JSON.parse(slice.slice(0, i + 1)) as T;
    }
  }
  throw new Error("unterminated JSON in completion");
}
