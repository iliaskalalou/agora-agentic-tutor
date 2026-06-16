import { getStore } from "../redis";
import type { SessionState } from "../../shared/types";

// Namespaced keys keep the Redis keyspace tidy and make analytics easy to read.
const SESSION_TTL_SECONDS = 60 * 60 * 6; // sessions live 6h — plenty for a demo

export const keys = {
  session: (id: string) => `agora:session:${id}`,
  events: (id: string) => `agora:session:${id}:events`,
  // Server-only blueprint (KB concepts with answers) and the active gradeable
  // question set. These never leave the server, so answers are never leaked.
  blueprint: (id: string) => `agora:session:${id}:blueprint`,
  grading: (id: string) => `agora:session:${id}:grading`,
  index: () => `agora:sessions:index`,
  stat: (name: string) => `agora:stat:${name}`,
};

export const EVENT_LOG_CAP = 600;

export async function saveSession(session: SessionState): Promise<void> {
  const store = getStore();
  session.updatedAt = Date.now();
  await store.setJSON(keys.session(session.id), session, SESSION_TTL_SECONDS);
}

export async function loadSession(id: string): Promise<SessionState | null> {
  return getStore().getJSON<SessionState>(keys.session(id));
}

export async function bumpStat(name: string, amount = 1): Promise<void> {
  await getStore().incrBy(keys.stat(name), amount);
}

export async function readStat(name: string): Promise<number> {
  return getStore().getNumber(keys.stat(name));
}
