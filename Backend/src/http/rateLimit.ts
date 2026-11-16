import type { NextFunction, Request, Response } from "express";
import { sql } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { AppError } from "./errors.js";

type LimitPolicy = {
  readonly name: string;
  readonly max: number;
  readonly windowMs: number;
  readonly message: string;
};

/** Saved policy: contact form 5 per 10 minutes per IP. */
const PUBLIC_CONTACT: LimitPolicy = {
  name: "public-contact",
  max: 5,
  windowMs: 10 * 60_000,
  message: "Too many contact submissions. Please try again later.",
};

/** Staff mutations (POST/PATCH/PUT/DELETE): 60 per minute per IP. */
const STAFF_WRITES: LimitPolicy = {
  name: "staff-write",
  max: 60,
  windowMs: 60_000,
  message: "Too many changes in a short time. Please wait a moment.",
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

type BucketRow = { count: number; reset_at: Date | string };

/**
 * Atomic fixed-window counter in PostgreSQL (table `rate_limit_bucket`).
 * One upsert per request, so every Node process on the VPS shares the same count.
 */
async function hit(
  key: string,
  policy: LimitPolicy,
): Promise<{ ok: boolean; retryAfterSec: number }> {
  const windowSec = Math.ceil(policy.windowMs / 1000);
  const result = await getDb().execute<BucketRow>(sql`
    insert into rate_limit_bucket as b (key, count, reset_at)
    values (${key}, 1, now() + make_interval(secs => ${windowSec}))
    on conflict (key) do update set
      count = case when b.reset_at <= now() then 1 else b.count + 1 end,
      reset_at = case
        when b.reset_at <= now() then now() + make_interval(secs => ${windowSec})
        else b.reset_at
      end
    returning count, reset_at
  `);
  if (Math.random() < 0.01) {
    pruneExpiredBuckets().catch((error: unknown) => {
      console.warn("rate limit prune failed", error);
    });
  }
  const row = result.rows[0];
  if (!row) {
    throw new Error("rate limit upsert returned no row");
  }
  const resetAt = new Date(row.reset_at).getTime();
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return { ok: row.count <= policy.max, retryAfterSec };
}

function clientKey(req: Request, policy: LimitPolicy): string {
  // req.ip is the real client address because app.ts sets `trust proxy` to loopback (Nginx).
  return `${policy.name}:${req.ip ?? "unknown"}`;
}

function limiter(policy: LimitPolicy, skipSafeMethods: boolean) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (skipSafeMethods && SAFE_METHODS.has(req.method)) {
      next();
      return;
    }
    hit(clientKey(req, policy), policy)
      .then((result) => {
        if (result.ok) {
          next();
          return;
        }
        res.setHeader("Retry-After", String(result.retryAfterSec));
        next(
          new AppError("RATE_LIMIT", policy.message, {
            retryAfterSec: result.retryAfterSec,
          }),
        );
      })
      .catch(() => {
        // Fail closed: a protected write must not run when its limiter is down.
        next(new AppError("UNAVAILABLE", "Service temporarily unavailable"));
      });
  };
}

export const rateLimitAdminWrites = limiter(STAFF_WRITES, true);
export const rateLimitPublicContact = limiter(PUBLIC_CONTACT, false);

/** Removes long-expired buckets. Runs on ~1% of hits so the table stays small without a scheduler. */
async function pruneExpiredBuckets(): Promise<void> {
  await getDb().execute(
    sql`delete from rate_limit_bucket where reset_at < now() - interval '1 hour'`,
  );
}
