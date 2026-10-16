import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = join(process.cwd(), "database", "migrations");

describe("reviewed auth migration SQL", () => {
  it("includes Better Auth core tables and admin columns", () => {
    const sqlFiles = readdirSync(migrationsDir).filter((name) =>
      name.endsWith(".sql"),
    );
    expect(sqlFiles.length).toBeGreaterThan(0);

    const combined = sqlFiles
      .map((name) => readFileSync(join(migrationsDir, name), "utf8"))
      .join("\n");

    for (const table of ["user", "session", "account", "verification"]) {
      expect(combined).toMatch(new RegExp(`CREATE TABLE[^;]*"${table}"`, "i"));
    }

    expect(combined).toMatch(/"email_verified"/);
    expect(combined).toMatch(/"ban_reason"/);
    expect(combined).toMatch(/"impersonated_by"/);
    expect(combined).toMatch(/FOREIGN KEY/);
  });
});
