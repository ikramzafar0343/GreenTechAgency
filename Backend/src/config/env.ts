export type BackendEnv = {
  readonly port: number;
  readonly frontendOrigins: readonly string[];
  readonly databaseUrl: string;
  readonly databaseUrlDirect: string;
  readonly betterAuthSecret: string;
  readonly betterAuthUrl: string;
};

type EnvSource = Record<string, string | undefined>;

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(
      `Missing required server environment variable: ${name}. See Rules/STACK_SELECTION.md.`,
    );
  }
  return trimmed;
}

function parsePort(value: string | undefined): number {
  const raw = value?.trim() || "4000";
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${raw}`);
  }
  return port;
}

function parseOrigins(value: string | undefined): readonly string[] {
  const raw = value?.trim() || "http://localhost:3000";
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Validates and returns server-only backend environment. */
export function getBackendEnv(source: EnvSource = process.env): BackendEnv {
  return {
    port: parsePort(source.PORT),
    frontendOrigins: parseOrigins(source.FRONTEND_ORIGIN),
    databaseUrl: required("DATABASE_URL", source.DATABASE_URL),
    databaseUrlDirect: required(
      "DATABASE_URL_DIRECT",
      source.DATABASE_URL_DIRECT,
    ),
    betterAuthSecret: required("BETTER_AUTH_SECRET", source.BETTER_AUTH_SECRET),
    betterAuthUrl: required("BETTER_AUTH_URL", source.BETTER_AUTH_URL),
  };
}

export function hasDatabaseEnv(source: EnvSource = process.env): boolean {
  return Boolean(
    source.DATABASE_URL?.trim() &&
      source.DATABASE_URL_DIRECT?.trim() &&
      source.BETTER_AUTH_SECRET?.trim() &&
      source.BETTER_AUTH_URL?.trim(),
  );
}

/** Pool settings recorded in STACK_SELECTION (per runtime instance). */
export const APP_POOL_SETTINGS = {
  max: 5,
  min: 0,
  connectionTimeoutMillis: 5_000,
  idleTimeoutMillis: 10_000,
} as const;
