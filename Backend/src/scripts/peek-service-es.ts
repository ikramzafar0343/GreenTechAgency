import { config as loadEnv } from "dotenv";
import { listPublishedServices } from "../features/services/public.js";
import { closeAppPool } from "../db/pool.js";
import { getDb } from "../db/client.js";
import { contentTranslation } from "../db/schema/translations.js";
import { and, eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const items = await listPublishedServices(5, "es");
  for (const item of items) {
    console.log("list", item.slug, item.title, "|", item.label);
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(contentTranslation)
    .where(
      and(
        eq(contentTranslation.entityType, "service"),
        eq(contentTranslation.locale, "es"),
      ),
    )
    .limit(3);
  for (const row of rows) {
    const doc = row.doc as { title?: string; label?: string };
    console.log("row", row.entityId, doc.title, doc.label);
  }
}

main()
  .catch(console.error)
  .finally(() => closeAppPool());
