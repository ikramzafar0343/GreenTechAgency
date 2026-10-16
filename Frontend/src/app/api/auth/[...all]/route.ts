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
  // undici rejects Expect: 100-continue when Node fetch proxies the request
  "expect",
]);

async function proxyToBackend(request: NextRequest): Promise<Response> {
  const incoming = new URL(request.url);
  const target = `${backendBaseUrl()}${incoming.pathname}${incoming.search}`;

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
    init.body = Buffer.from(await request.arrayBuffer());
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      return;
    }
    responseHeaders.append(key, value);
  });
  // Preserve multiple Set-Cookie values (session_token + session_data).
  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : [];
  for (const cookie of setCookies) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) {
  return proxyToBackend(request);
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request);
}

export async function PUT(request: NextRequest) {
  return proxyToBackend(request);
}

export async function PATCH(request: NextRequest) {
  return proxyToBackend(request);
}

export async function DELETE(request: NextRequest) {
  return proxyToBackend(request);
}
