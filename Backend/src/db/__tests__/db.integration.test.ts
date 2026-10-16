import { describe, expect, it } from "vitest";
import { sql } from "drizzle-orm";
import { hasDatabaseEnv } from "../../config/env.js";

const canRun = hasDatabaseEnv();

describe.runIf(canRun)("database integration", () => {
  it("connects with the application pool and reports PostgreSQL 18", async () => {
    const { getDb } = await import("../client.js");
    const db = getDb();
    const rows = await db.execute<{ version: string }>(sql`select version()`);
    const version = rows.rows[0]?.version ?? "";
    expect(version).toMatch(/PostgreSQL 18\./);
  });

  it("has Better Auth tables after migrations", async () => {
    const { getDb } = await import("../client.js");
    const db = getDb();
    const rows = await db.execute<{ tablename: string }>(sql`
      select tablename
      from pg_tables
      where schemaname = 'public'
        and tablename in ('user', 'session', 'account', 'verification')
      order by tablename
    `);
    const names = rows.rows.map((row) => row.tablename);
    expect(names).toEqual(["account", "session", "user", "verification"]);
  });
});

describe.runIf(!canRun)("database integration (blocked)", () => {
  it("skips until DATABASE_URL, DATABASE_URL_DIRECT, BETTER_AUTH_SECRET, BETTER_AUTH_URL are set", () => {
    expect(canRun).toBe(false);
  });
});
