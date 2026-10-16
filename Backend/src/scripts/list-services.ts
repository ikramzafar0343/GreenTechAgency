import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { service } from "../db/schema/services.js";
import { closeAppPool } from "../db/pool.js";

loadEnv({ path: ".env.local" });
loadEnv();

async function main() {
  const db = getDb();
  const rows = await db
    .select()
    .from(service)
    .where(eq(service.status, "published"));
  for (const r of rows) {
    const d = r.publishedDoc as {
      title?: string;
      label?: string;
      shortDescription?: string;
    };
    console.log(
      JSON.stringify({
        id: r.id,
        slug: r.publishedSlug,
        title: d.title,
        label: d.label,
        short: d.shortDescription?.slice(0, 120),
      }),
    );
  }
}

main()
  .catch(console.error)
  .finally(() => closeAppPool());
