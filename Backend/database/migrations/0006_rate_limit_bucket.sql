-- Shared fixed-window rate limit counters (one row per key).
-- Atomic upsert in src/http/rateLimit.ts keeps every process in sync.
CREATE TABLE IF NOT EXISTS "rate_limit_bucket" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"reset_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rate_limit_bucket_reset_idx" ON "rate_limit_bucket" ("reset_at");
