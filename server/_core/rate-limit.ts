import type { NextFunction, Request, Response } from "express";

type Options = {
  windowMs: number;
  max: number;
  message?: string;
  key?: (req: Request) => string;
};

type Entry = { count: number; resetAt: number };

/**
 * Small in-memory fixed-window rate limiter, keyed by client IP by default.
 *
 * Intended as a coarse flood guard in front of the HTTP API. The stricter,
 * DB-backed per-account login limiter lives in `server/auth-rate-limit.ts`.
 * This limiter is per-process, which is appropriate for a single-instance
 * deployment; move the counters to a shared store if you run many replicas.
 */
export function createRateLimiter({ windowMs, max, message, key }: Options) {
  const hits = new Map<string, Entry>();
  let sinceSweep = 0;

  const sweep = () => {
    const now = Date.now();
    hits.forEach((entry, id) => {
      if (entry.resetAt <= now) hits.delete(id);
    });
  };

  return function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    if (++sinceSweep >= 500) {
      sinceSweep = 0;
      sweep();
    }

    const id = key ? key(req) : req.ip || req.socket.remoteAddress || "unknown";
    const entry = hits.get(id);

    if (!entry || entry.resetAt <= now) {
      hits.set(id, { count: 1, resetAt: now + windowMs });
    } else if (entry.count >= max) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      res.status(429).json({ error: message ?? "Too many requests. Please try again later." });
      return;
    } else {
      entry.count += 1;
    }

    next();
  };
}
