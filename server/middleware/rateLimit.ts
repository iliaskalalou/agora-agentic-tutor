import type { Request, Response, NextFunction } from "express";

// Tiny dependency-free in-memory rate limiter. Enough to stop a public demo URL
// from being trivially hammered into spawning unbounded autonomous runs. For a
// multi-instance production system this would move to a Redis token bucket.
interface Bucket {
  count: number;
  resetAt: number;
}

export function rateLimit(opts: { windowMs: number; max: number }) {
  const buckets = new Map<string, Bucket>();

  return (req: Request, res: Response, next: NextFunction) => {
    // Only throttle writes (which spawn autonomous compute or OCR). Reads —
    // including the client polling GET /api/sessions/:id — pass through freely.
    if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
      return next();
    }
    const now = Date.now();
    const key = req.ip ?? "global";

    // Opportunistic sweep so the map cannot grow without bound.
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    res.setHeader("X-RateLimit-Limit", String(opts.max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, opts.max - bucket.count)));

    if (bucket.count > opts.max) {
      res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json({ error: "rate limit exceeded — slow down" });
    }
    next();
  };
}
