/**
 * Local embedded Postgres for development (no Docker / system service required).
 * Keep this process running while Backend + Frontend are up.
 */
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const databaseDir = path.join(root, ".data", "pg");
const port = Number(process.env.LOCAL_PG_PORT || 5433);
const user = "postgres";
const password = process.env.LOCAL_PG_PASSWORD || "greentech_local";
const database = "greentech";

mkdirSync(databaseDir, { recursive: true });

const pg = new EmbeddedPostgres({
  databaseDir,
  user,
  password,
  port,
  persistent: true,
  // Windows system locale often yields WIN1252 clusters; force UTF-8 for i18n.
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
});

const initialized = existsSync(path.join(databaseDir, "PG_VERSION"));

async function main() {
  if (!initialized) {
    console.log("Initializing local Postgres cluster…");
    await pg.initialise();
  }
  console.log(`Starting Postgres on port ${port}…`);
  await pg.start();
  try {
    await pg.createDatabase(database);
    console.log(`Created database "${database}"`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/already exists/i.test(message)) {
      console.warn("createDatabase:", message);
    }
  }
  const url = `postgresql://${user}:${encodeURIComponent(password)}@127.0.0.1:${port}/${database}`;
  console.log(`LOCAL_DATABASE_URL=${url}`);
  console.log("Local Postgres is ready. Leave this terminal open.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
