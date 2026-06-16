import { EventEmitter } from "node:events";
import Redis from "ioredis";
import { config } from "./config";
import { logger } from "./logger";

// ---------------------------------------------------------------------------
// Storage + pub/sub abstraction. The orchestrator and routes only ever talk to
// this `Store` interface, so the exact same agent code runs against a real
// Scalingo Redis addon (production) or an in-process fallback (demo-safe, no
// addon required). Redis is used for three real jobs here:
//   1. durable session state + replayable per-session event logs
//   2. cross-instance pub/sub that fans agent events out to SSE clients
//   3. global analytics counters
// ---------------------------------------------------------------------------

export interface Store {
  readonly backend: "redis" | "memory";
  getJSON<T>(key: string): Promise<T | null>;
  setJSON(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  incrBy(key: string, amount: number): Promise<number>;
  getNumber(key: string): Promise<number>;
  rpushCapped(key: string, value: string, cap: number): Promise<void>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  publish(channel: string, message: string): Promise<void>;
  subscribe(channel: string, handler: (message: string) => void): Promise<() => void>;
  ping(): Promise<boolean>;
  close(): Promise<void>;
}

// ----------------------------- In-memory backend ---------------------------

class MemoryStore implements Store {
  readonly backend = "memory" as const;
  private kv = new Map<string, string>();
  private lists = new Map<string, string[]>();
  private numbers = new Map<string, number>();
  private bus = new EventEmitter();

  constructor() {
    this.bus.setMaxListeners(0);
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = this.kv.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJSON(key: string, value: unknown): Promise<void> {
    this.kv.set(key, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    this.kv.delete(key);
    this.lists.delete(key);
    this.numbers.delete(key);
  }

  async incrBy(key: string, amount: number): Promise<number> {
    const next = (this.numbers.get(key) ?? 0) + amount;
    this.numbers.set(key, next);
    return next;
  }

  async getNumber(key: string): Promise<number> {
    return this.numbers.get(key) ?? 0;
  }

  async rpushCapped(key: string, value: string, cap: number): Promise<void> {
    const list = this.lists.get(key) ?? [];
    list.push(value);
    if (list.length > cap) list.splice(0, list.length - cap);
    this.lists.set(key, list);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const list = this.lists.get(key) ?? [];
    const end = stop === -1 ? list.length : stop + 1;
    return list.slice(start, end);
  }

  async publish(channel: string, message: string): Promise<void> {
    // Defer so publishers never reenter a subscriber synchronously.
    setImmediate(() => this.bus.emit(channel, message));
  }

  async subscribe(
    channel: string,
    handler: (message: string) => void,
  ): Promise<() => void> {
    this.bus.on(channel, handler);
    return () => this.bus.off(channel, handler);
  }

  async ping(): Promise<boolean> {
    return true;
  }

  async close(): Promise<void> {
    this.bus.removeAllListeners();
  }
}

// ------------------------------- Redis backend -----------------------------

class RedisStore implements Store {
  readonly backend = "redis" as const;
  private pub: Redis;
  private sub: Redis;
  private handlers = new Map<string, Set<(message: string) => void>>();

  constructor(url: string) {
    const opts = {
      maxRetriesPerRequest: 2,
      connectTimeout: 8000,
      retryStrategy: (times: number) => (times > 8 ? null : Math.min(times * 200, 2000)),
    };
    this.pub = new Redis(url, opts);
    this.sub = new Redis(url, opts);

    for (const [name, client] of [
      ["publisher", this.pub],
      ["subscriber", this.sub],
    ] as const) {
      client.on("error", (err) => logger.warn({ err: err.message, name }, "redis error"));
    }

    this.sub.on("message", (channel, message) => {
      const set = this.handlers.get(channel);
      if (set) for (const h of set) h(message);
    });
  }

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await this.pub.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async setJSON(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const raw = JSON.stringify(value);
    if (ttlSeconds) await this.pub.set(key, raw, "EX", ttlSeconds);
    else await this.pub.set(key, raw);
  }

  async del(key: string): Promise<void> {
    await this.pub.del(key);
  }

  async incrBy(key: string, amount: number): Promise<number> {
    return this.pub.incrby(key, amount);
  }

  async getNumber(key: string): Promise<number> {
    const raw = await this.pub.get(key);
    return raw ? Number(raw) : 0;
  }

  async rpushCapped(key: string, value: string, cap: number): Promise<void> {
    await this.pub.multi().rpush(key, value).ltrim(key, -cap, -1).exec();
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return this.pub.lrange(key, start, stop);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.pub.publish(channel, message);
  }

  async subscribe(
    channel: string,
    handler: (message: string) => void,
  ): Promise<() => void> {
    let set = this.handlers.get(channel);
    if (!set) {
      set = new Set();
      this.handlers.set(channel, set);
      await this.sub.subscribe(channel);
    }
    set.add(handler);
    return () => {
      set!.delete(handler);
      if (set!.size === 0) {
        this.handlers.delete(channel);
        void this.sub.unsubscribe(channel);
      }
    };
  }

  async ping(): Promise<boolean> {
    try {
      const res = await this.pub.ping();
      return res === "PONG";
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await Promise.allSettled([this.pub.quit(), this.sub.quit()]);
  }
}

// ------------------------------- Factory -----------------------------------

let store: Store | null = null;

export async function initStore(): Promise<Store> {
  if (store) return store;

  if (config.redisUrl) {
    try {
      const candidate = new RedisStore(config.redisUrl);
      const ok = await candidate.ping();
      if (ok) {
        logger.info("connected to Redis backend");
        store = candidate;
        return store;
      }
      logger.warn("Redis ping failed; falling back to in-memory store");
      await candidate.close();
    } catch (err) {
      logger.warn({ err: (err as Error).message }, "Redis init failed; using in-memory store");
    }
  } else {
    logger.info("no REDIS_URL configured; using in-memory store (demo-safe mode)");
  }

  store = new MemoryStore();
  return store;
}

export function getStore(): Store {
  if (!store) throw new Error("Store not initialized — call initStore() first");
  return store;
}
