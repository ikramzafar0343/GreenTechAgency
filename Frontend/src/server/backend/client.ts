import "server-only";

import { cookies, headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { getBackendUrl } from "@/server/backend/env";

async function resolveContentLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch {
    return "en";
  }
}

function withLocaleQuery(path: string, locale: string): string {
  if (!locale || locale === "en") {
    // Still send locale so Backend can treat English explicitly when needed.
  }
  const join = path.includes("?") ? "&" : "?";
  return `${path}${join}locale=${encodeURIComponent(locale)}`;
}

export class BackendHttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "BackendHttpError";
    this.status = status;
    this.code = code;
    this.details = details ?? null;
  }
}

type FetchOptions = {
  method?: string;
  body?: unknown;
  withSession?: boolean;
  cache?: RequestCache;
};

async function buildSessionHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieHeader = cookieStore.toString();
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    "http://localhost:3000";
  const result: Record<string, string> = {
    Accept: "application/json",
    Origin: origin,
  };
  if (cookieHeader) {
    result.Cookie = cookieHeader;
  }
  return result;
}

export async function backendFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = `${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const init: RequestInit = {
    method: options.method ?? "GET",
    cache: options.cache ?? "no-store",
    headers: options.withSession
      ? await buildSessionHeaders()
      : { Accept: "application/json" },
  };
  if (options.body !== undefined) {
    (init.headers as Record<string, string>)["Content-Type"] =
      "application/json";
    init.body = JSON.stringify(options.body);
  }
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    throw new BackendHttpError(
      503,
      "UNAVAILABLE",
      err instanceof Error ? err.message : "Backend unreachable",
    );
  }
  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text) as unknown;
    } catch {
      payload = { message: text };
    }
  }
  if (!response.ok) {
    const row = (payload ?? {}) as Record<string, unknown>;
    throw new BackendHttpError(
      response.status,
      String(row.error ?? "INTERNAL"),
      String(row.message ?? response.statusText),
      row.details,
    );
  }
  return payload as T;
}

export async function backendPublicGet<T>(path: string): Promise<T> {
  const locale = await resolveContentLocale();
  return backendFetch<T>(withLocaleQuery(path, locale), { cache: "no-store" });
}

export async function backendAdminGet<T>(path: string): Promise<T> {
  return backendFetch<T>(path, { withSession: true, cache: "no-store" });
}

export async function backendAdminMutate<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  return backendFetch<T>(path, { method, body, withSession: true });
}
