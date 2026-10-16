import { drizzle } from "drizzle-orm/node-postgres";
import { getAppPool } from "./pool.js";
import * as schema from "./schema/index.js";

export type AppDatabase = ReturnType<typeof createDb>;

function createDb() {
  return drizzle(getAppPool(), { schema });
}

type GlobalDb = {
  appDb?: AppDatabase;
};

const globalForDb = globalThis as typeof globalThis & GlobalDb;

/** Drizzle client bound to the application pool. */
export function getDb(): AppDatabase {
  if (globalForDb.appDb) {
    return globalForDb.appDb;
  }
  const db = createDb();
  globalForDb.appDb = db;
  return db;
}
