#!/usr/bin/env node
// Runs in Scalingo's postdeploy one-off container. Verifies the Redis addon is
// reachable (the handbook's "Redis connection check"). Never fails the deploy:
// Agora degrades gracefully to its in-memory store if Redis is unavailable.
import Redis from "ioredis";

const url = process.env.REDIS_URL || process.env.SCALINGO_REDIS_URL;

async function main() {
  if (!url) {
    console.log("ℹ️  No Redis URL present — Agora will run in in-memory demo-safe mode.");
    return;
  }
  const client = new Redis(url, { maxRetriesPerRequest: 2, connectTimeout: 8000, lazyConnect: true });
  try {
    await client.connect();
    const pong = await client.ping();
    const key = "agora:postdeploy:check";
    await client.set(key, new Date().toISOString(), "EX", 60);
    const value = await client.get(key);
    console.log(`✅ Redis reachable (PING=${pong}), round-trip write/read OK (${value}).`);
  } catch (err) {
    console.log(`⚠️  Redis check failed (${err.message}) — falling back to in-memory store.`);
  } finally {
    client.disconnect();
  }
}

main();
