import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = join(process.cwd(), "database", "migrations");

describe("content CMS migration", () => {
  it("includes CMS tables and subservice FK", () => {
    const sqlFiles = readdirSync(migrationsDir).filter((name) =>
      name.endsWith(".sql"),
    );
    const combined = sqlFiles
      .map((name) => readFileSync(join(migrationsDir, name), "utf8"))
      .join("\n");

    for (const table of [
      "service",
      "subservice",
      "blog_post",
      "portfolio_project",
      "section_setting",
      "media_asset",
      "content_redirect",
      "admin_audit_log",
      "faq_item",
      "testimonial",
      "stat_metric",
      "site_document",
      "enquiry",
    ]) {
      expect(combined).toMatch(new RegExp(`CREATE TABLE[^;]*"${table}"`, "i"));
    }
    expect(combined).toMatch(/subservice_service_id_service_id_fk/);
  });
});
