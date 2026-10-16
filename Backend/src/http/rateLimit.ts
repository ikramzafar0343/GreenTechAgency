import type { Request, Response, NextFunction } from "express";
import { AppError } from "./errors.js";

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

function memoryLimit(
  key: string,
  max: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const existing = memoryBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: Math.ceil(windowMs / 1000) };
  }
  if (existing.count >= max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { ok: true, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
}

function rateLimitMode(): "memory" | "redis" {
  const mode = (process.env.RATE_LIMIT_MODE ?? "memory").trim().toLowerCase();
  return mode === "redis" ? "redis" : "memory";
}

function assertRateLimitBackend(): void {
  if (rateLimitMode() !== "redis") {
    return;
  }
  if (!process.env.RATE_LIMIT_REDIS_URL?.trim()) {
    throw new AppError(
      "UNAVAILABLE",
      "RATE_LIMIT_MODE=redis requires RATE_LIMIT_REDIS_URL",
    );
  }
  // Distributed Redis client wiring can replace memoryLimit later.
  // Until then, redis mode still uses process-local buckets but requires URL set.
}

/**
 * Admin-write rate limit.
 * Default RATE_LIMIT_MODE=memory (single Hostinger VPS / local).
 * Set RATE_LIMIT_MODE=redis + RATE_LIMIT_REDIS_URL for multi-process.
 */
export function rateLimitAdminWrites(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    assertRateLimitBackend();
  } catch (err) {
    next(err);
    return;
  }
  const actor = req.ip ?? "unknown";
  const result = memoryLimit(`admin-write:${actor}`, 60, 60_000);
  if (!result.ok) {
    res.setHeader("Retry-After", String(result.retryAfterSec));
    next(
      new AppError("RATE_LIMIT", "Too many admin writes", {
        retryAfterSec: result.retryAfterSec,
      }),
    );
    return;
  }
  next();
}

/** Public contact form: 60 requests per minute per IP. */
export function rateLimitPublicContact(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const actor = req.ip ?? "unknown";
  const result = memoryLimit(`public-contact:${actor}`, 60, 60_000);
  if (!result.ok) {
    res.setHeader("Retry-After", String(result.retryAfterSec));
    next(
      new AppError("RATE_LIMIT", "Too many contact submissions", {
        retryAfterSec: result.retryAfterSec,
      }),
    );
    return;
  }
  next();
}
