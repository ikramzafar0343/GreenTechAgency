import { Pool, type PoolConfig } from "pg";
import { APP_POOL_SETTINGS, getBackendEnv } from "../config/env.js";

type GlobalPool = {
  pgPool?: Pool | undefined;
};

const globalForPg = globalThis as typeof globalThis & GlobalPool;

function buildPoolConfig(connectionString: string): PoolConfig {
  return {
    connectionString,
    max: APP_POOL_SETTINGS.max,
    min: APP_POOL_SETTINGS.min,
    connectionTimeoutMillis: APP_POOL_SETTINGS.connectionTimeoutMillis,
    idleTimeoutMillis: APP_POOL_SETTINGS.idleTimeoutMillis,
    // Embedded Postgres on Windows may default to WIN1252; force UTF-8 for i18n.
    options: "-c client_encoding=UTF8",
  };
}

/** Application pool (pooled Neon URL). Reused for the process lifetime. */
export function getAppPool(): Pool {
  if (globalForPg.pgPool) {
    return globalForPg.pgPool;
  }

  const { databaseUrl } = getBackendEnv();
  const pool = new Pool(buildPoolConfig(databaseUrl));
  globalForPg.pgPool = pool;
  return pool;
}

/** Direct connection pool for migrations/admin tooling only. */
export function createDirectPool(): Pool {
  const { databaseUrlDirect } = getBackendEnv();
  return new Pool(buildPoolConfig(databaseUrlDirect));
}

export async function closeAppPool(): Promise<void> {
  if (!globalForPg.pgPool) {
    return;
  }
  await globalForPg.pgPool.end();
  globalForPg.pgPool = undefined;
}
