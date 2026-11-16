import { Pool, type PoolConfig } from "pg";
import { APP_POOL_SETTINGS, getBackendEnv } from "../config/env.js";

type GlobalPool = {
  pgPool?: Pool | undefined;
};

const globalForPg = globalThis as typeof globalThis & GlobalPool;

/** Runtime guard rails for app queries; migrations use the direct pool without them. */
const APP_SESSION_OPTIONS =
  "-c client_encoding=UTF8 -c statement_timeout=5000 -c lock_timeout=2000 -c idle_in_transaction_session_timeout=10000";

function buildPoolConfig(connectionString: string, options: string): PoolConfig {
  return {
    connectionString,
    max: APP_POOL_SETTINGS.max,
    min: APP_POOL_SETTINGS.min,
    connectionTimeoutMillis: APP_POOL_SETTINGS.connectionTimeoutMillis,
    idleTimeoutMillis: APP_POOL_SETTINGS.idleTimeoutMillis,
    // Embedded Postgres on Windows may default to WIN1252; force UTF-8 for i18n.
    options,
  };
}

/** Application pool. Reused for the process lifetime. */
export function getAppPool(): Pool {
  if (globalForPg.pgPool) {
    return globalForPg.pgPool;
  }

  const { databaseUrl } = getBackendEnv();
  const pool = new Pool(buildPoolConfig(databaseUrl, APP_SESSION_OPTIONS));
  // An idle client can error (e.g. Postgres restart); log it instead of crashing the process.
  pool.on("error", (error) => {
    console.error("Idle Postgres client error", error);
  });
  globalForPg.pgPool = pool;
  return pool;
}

/** Direct connection pool for migrations/admin tooling only. */
export function createDirectPool(): Pool {
  const { databaseUrlDirect } = getBackendEnv();
  return new Pool(buildPoolConfig(databaseUrlDirect, "-c client_encoding=UTF8"));
}

export async function closeAppPool(): Promise<void> {
  if (!globalForPg.pgPool) {
    return;
  }
  await globalForPg.pgPool.end();
  globalForPg.pgPool = undefined;
}
