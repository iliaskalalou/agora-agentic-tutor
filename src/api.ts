import type {
  AgentEvent,
  AggregateStats,
  CreateSessionRequest,
  CurriculumTree,
  GoalPreset,
  SessionState,
  UploadResponse,
} from "../shared/types";

export interface RuntimeInfo {
  provider: string;
  llmLive: boolean;
  storeBackend: string;
  maxRunSteps: number;
}

async function jget<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

async function jpost<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`POST ${url} -> ${res.status} ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  info: () => jget<RuntimeInfo>("/api/info"),
  presets: () => jget<{ presets: GoalPreset[] }>("/api/presets"),
  curriculum: () => jget<{ curriculum: CurriculumTree }>("/api/curriculum"),
  stats: () => jget<{ stats: AggregateStats }>("/api/stats"),
  createSession: (body: CreateSessionRequest) =>
    jpost<{ session: SessionState }>("/api/sessions", body),
  answer: (id: string, questionId: string, answer: number | string) =>
    jpost<{ ok: boolean }>(`/api/sessions/${id}/answer`, { questionId, answer }),
  uploadDocument: async (id: string, file: File): Promise<UploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`/api/sessions/${id}/document`, { method: "POST", body: form });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(detail.error ?? `upload failed (${res.status})`);
    }
    return res.json() as Promise<UploadResponse>;
  },
};

// Subscribe to a session's live agent event stream. Returns an unsubscribe fn.
export function streamSession(id: string, onEvent: (e: AgentEvent) => void): () => void {
  const es = new EventSource(`/events/${id}`);
  es.onmessage = (e) => {
    try {
      onEvent(JSON.parse(e.data) as AgentEvent);
    } catch {
      /* ignore keep-alive comments */
    }
  };
  return () => es.close();
}
