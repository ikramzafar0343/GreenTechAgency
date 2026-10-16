import { config as loadEnv } from "dotenv";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { contentTranslation } from "../db/schema/translations.js";
import { getPublishedSiteDocument } from "../features/siteDocuments/public.js";
import { closeAppPool } from "../db/pool.js";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const db = getDb();
  const rows = await db
    .select()
    .from(contentTranslation)
    .where(
      and(
        eq(contentTranslation.entityType, "site_document"),
        eq(contentTranslation.entityId, "hero"),
      ),
    );
  console.log("rows", rows.length);
  for (const row of rows) {
    const doc = row.doc as { headline?: string };
    console.log(row.locale, row.publicationStatus, doc.headline);
  }
  for (const locale of ["en", "es", "ar", "de", "fr"] as const) {
    const doc = await getPublishedSiteDocument("hero", locale);
    console.log("api", locale, (doc as { headline?: string }).headline);
  }
}

main()
  .catch(console.error)
  .finally(() => closeAppPool());
