import type { RequestHandler } from "express";
import { HttpError } from "./http.js";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 600_000);
cleanup.unref();

/**
 * In-memory fixed-window rate limiter (per IP + route).
 * Instance-local by design: behind serverless it is defense-in-depth only;
 * a shared store (e.g. Upstash/Redis) is required for global limits.
 */
export function rateLimit(options: { windowMs: number; max: number; keyPrefix: string }): RequestHandler {
  return (req, res, next) => {
    const ip = (req.ip ?? req.socket.remoteAddress ?? "unknown").toString();
    const key = `${options.keyPrefix}:${ip}`;
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }
    bucket.count += 1;
    if (bucket.count > options.max) {
      res.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      return next(new HttpError(429, "RATE_LIMITED", "Too many requests, try again later"));
    }
    next();
  };
}
