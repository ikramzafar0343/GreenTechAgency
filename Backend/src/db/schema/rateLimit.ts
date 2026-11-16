import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/** Shared fixed-window counters used by src/http/rateLimit.ts. */
export const rateLimitBucket = pgTable(
  "rate_limit_bucket",
  {
    key: text("key").primaryKey(),
    count: integer("count").notNull(),
    resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("rate_limit_bucket_reset_idx").on(t.resetAt)],
);
