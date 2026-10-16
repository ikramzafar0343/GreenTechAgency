/**
 * One-shot: stop embedded Postgres, wipe the WIN1252 cluster, re-init as UTF-8.
 * Run: node scripts/recreate-utf8-pg.mjs
 * Then: npm run db:local  (in another terminal)
 * Then: npm run db:migrate && npm run content:import
 */
import { existsSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import EmbeddedPostgres from "embedded-postgres";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const databaseDir = path.join(root, ".data", "pg");
const backupDir = path.join(
  root,
  ".data",
  `pg-win1252-backup-${Date.now()}`,
);
const port = Number(process.env.LOCAL_PG_PORT || 5433);
const user = "postgres";
const password = process.env.LOCAL_PG_PASSWORD || "greentech_local";

async function tryStop() {
  if (!existsSync(path.join(databaseDir, "PG_VERSION"))) {
    console.log("No existing cluster.");
    return;
  }
  const pg = new EmbeddedPostgres({
    databaseDir,
    user,
    password,
    port,
    persistent: true,
  });
  try {
    await pg.stop();
    console.log("Stopped existing cluster.");
  } catch (err) {
    console.warn(
      "Could not stop via embedded-postgres (may already be down):",
      err instanceof Error ? err.message : err,
    );
  }
}

async function main() {
  await tryStop();
  if (existsSync(databaseDir)) {
    renameSync(databaseDir, backupDir);
    console.log(`Moved old cluster to ${backupDir}`);
  }
  const pg = new EmbeddedPostgres({
    databaseDir,
    user,
    password,
    port,
    persistent: true,
    initdbFlags: ["--encoding=UTF8", "--locale=C"],
  });
  console.log("Initializing UTF-8 cluster…");
  await pg.initialise();
  console.log("Starting…");
  await pg.start();
  try {
    await pg.createDatabase("greentech");
    console.log('Created database "greentech"');
  } catch (err) {
    console.warn(err instanceof Error ? err.message : err);
  }
  console.log("UTF-8 cluster ready on port", port);
  console.log("Leave this process running, or stop and use npm run db:local.");
  // Keep alive like db:local
  await new Promise(() => {});
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
