/**
 * Reports published CMS translation coverage per locale × entity type.
 */
import { config as loadEnv } from "dotenv";
import { sql } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { closeAppPool } from "../db/pool.js";
import { CONTENT_LOCALES } from "../db/schema/translations.js";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const db = getDb();
  const sources = await db.execute(sql`
    SELECT 'service' AS entity_type, count(*)::int AS n FROM service WHERE status = 'published'
    UNION ALL SELECT 'subservice', count(*)::int FROM subservice WHERE status = 'published'
    UNION ALL SELECT 'blog_post', count(*)::int FROM blog_post WHERE status = 'published'
    UNION ALL SELECT 'portfolio_project', count(*)::int FROM portfolio_project WHERE status = 'published'
    UNION ALL SELECT 'faq_item', count(*)::int FROM faq_item WHERE status = 'published'
    UNION ALL SELECT 'testimonial', count(*)::int FROM testimonial WHERE status = 'published'
    UNION ALL SELECT 'stat_metric', count(*)::int FROM stat_metric WHERE status = 'published'
    UNION ALL SELECT 'site_document', count(*)::int FROM site_document WHERE published_doc IS NOT NULL
    UNION ALL SELECT 'section_setting', count(*)::int FROM section_setting WHERE published_doc IS NOT NULL
  `);

  const sourceMap = new Map<string, number>();
  for (const row of sources.rows as Array<{ entity_type: string; n: number }>) {
    sourceMap.set(row.entity_type, row.n);
  }

  const translations = await db.execute(sql`
    SELECT entity_type, locale, count(*)::int AS n
    FROM content_translation
    WHERE publication_status = 'published'
    GROUP BY entity_type, locale
    ORDER BY entity_type, locale
  `);

  const byLocale = new Map<string, Map<string, number>>();
  for (const row of translations.rows as Array<{
    entity_type: string;
    locale: string;
    n: number;
  }>) {
    if (!byLocale.has(row.locale)) byLocale.set(row.locale, new Map());
    byLocale.get(row.locale)!.set(row.entity_type, row.n);
  }

  console.log("SOURCE COUNTS");
  for (const [type, n] of sourceMap) console.log(`  ${type}: ${n}`);

  console.log("\nCOVERAGE");
  console.log(
    "Locale | Entity | Source | Translated | Missing",
  );
  for (const locale of CONTENT_LOCALES) {
    if (locale === "en") continue;
    const map = byLocale.get(locale) ?? new Map();
    for (const [type, source] of sourceMap) {
      const translated = map.get(type) ?? 0;
      const missing = Math.max(0, source - translated);
      console.log(
        `${locale} | ${type} | ${source} | ${translated} | ${missing}`,
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => closeAppPool());
