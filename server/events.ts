import { nanoid } from "nanoid";
import { getStore } from "./redis";
import { keys, EVENT_LOG_CAP } from "./store/sessionStore";
import type { AgentEvent, AgentEventType, AgentKind } from "../shared/types";

// Channel name a session publishes its agent events on. SSE clients subscribe
// to exactly this channel, so events fan out across instances via Redis pub/sub.
export const channelFor = (sessionId: string) => `agora:events:${sessionId}`;

interface EmitInput {
  sessionId: string;
  agent: AgentKind;
  type: AgentEventType;
  title: string;
  detail?: string;
  data?: Record<string, unknown>;
}

// Build, persist (replayable log) and broadcast a single agent event.
export async function emitEvent(input: EmitInput): Promise<AgentEvent> {
  const event: AgentEvent = {
    id: nanoid(10),
    sessionId: input.sessionId,
    ts: Date.now(),
    agent: input.agent,
    type: input.type,
    title: input.title,
    detail: input.detail,
    data: input.data,
  };
  const store = getStore();
  const serialized = JSON.stringify(event);
  await store.rpushCapped(keys.events(input.sessionId), serialized, EVENT_LOG_CAP);
  await store.publish(channelFor(input.sessionId), serialized);
  return event;
}

// Replay the persisted event log so a late-joining SSE client sees history.
export async function replayEvents(sessionId: string): Promise<AgentEvent[]> {
  const raw = await getStore().lrange(keys.events(sessionId), 0, -1);
  return raw.map((r) => JSON.parse(r) as AgentEvent);
}
