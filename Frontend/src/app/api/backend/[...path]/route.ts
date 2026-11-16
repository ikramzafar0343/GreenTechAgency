import { type NextRequest } from "next/server";
import { getBackendUrl } from "@/server/backend/env";

/**
 * Same-origin bridge from the browser (admin/employee portals) to the Backend API.
 * Only `/api/*` paths are forwarded, only allowlisted headers travel upstream,
 * bodies are size-capped and every call has a deadline.
 */

const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "content-type",
  "cookie",
  "idempotency-key",
  "if-match",
  "origin",
  "referer",
  "user-agent",
  "x-forwarded-for",
] as const;

/** Response headers that must not be copied (the body is already decoded/re-framed). */
const STRIPPED_RESPONSE_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "transfer-encoding",
]);

const MAX_BODY_BYTES = 50 * 1024 * 1024; // matches Nginx client_max_body_size (media uploads)
const READ_TIMEOUT_MS = 5_000;
const WRITE_TIMEOUT_MS = 30_000; // uploads of large media need longer than ordinary writes

function problem(status: number, message: string): Response {
  return Response.json({ error: "PROXY", message }, { status });
}

async function proxy(request: NextRequest): Promise<Response> {
  const incoming = new URL(request.url);
  const suffix = incoming.pathname.replace(/^\/api\/backend/, "") || "/";
  if (!suffix.startsWith("/api/") || suffix.includes("..")) {
    return problem(404, "Not found");
  }

  let base: string;
  try {
    base = getBackendUrl();
  } catch {
    return problem(503, "Backend is not configured");
  }

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));

  const isRead = request.method === "GET" || request.method === "HEAD";
  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    signal: AbortSignal.timeout(isRead ? READ_TIMEOUT_MS : WRITE_TIMEOUT_MS),
  };

  if (!isRead) {
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (declared > MAX_BODY_BYTES) {
      return problem(413, "Request body is too large");
    }
    // Buffered so multipart boundaries stay intact for Backend busboy.
    const body = Buffer.from(await request.arrayBuffer());
    if (body.byteLength > MAX_BODY_BYTES) {
      return problem(413, "Request body is too large");
    }
    init.body = body;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${base}${suffix}${incoming.search}`, init);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return problem(timedOut ? 504 : 502, timedOut ? "Backend timed out" : "Backend unreachable");
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const name = key.toLowerCase();
    if (name !== "set-cookie" && !STRIPPED_RESPONSE_HEADERS.has(name)) {
      responseHeaders.set(key, value);
    }
  });
  // forEach() joins multiple Set-Cookie values into one string; copy them one by one.
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return proxy(request);
}
export async function POST(request: NextRequest) {
  return proxy(request);
}
export async function PUT(request: NextRequest) {
  return proxy(request);
}
export async function PATCH(request: NextRequest) {
  return proxy(request);
}
export async function DELETE(request: NextRequest) {
  return proxy(request);
}
