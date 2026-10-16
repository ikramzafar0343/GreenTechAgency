import { type NextRequest } from "next/server";

function backendBaseUrl(): string {
  const configured = process.env.BACKEND_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return "http://localhost:4000";
}

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

async function proxy(request: NextRequest): Promise<Response> {
  const incoming = new URL(request.url);
  const suffix = incoming.pathname.replace(/^\/api\/backend/, "") || "/";
  const target = `${backendBaseUrl()}${suffix}${incoming.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) {
      return;
    }
    headers.set(key, value);
  });
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", incoming.protocol.replace(":", ""));
  if (!headers.get("origin")) {
    headers.set("origin", `${incoming.protocol}//${incoming.host}`);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    // Buffer the body so multipart boundaries stay intact for Backend busboy.
    init.body = Buffer.from(await request.arrayBuffer());
  }

  const upstream = await fetch(target, init);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: upstream.headers,
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
