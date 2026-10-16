import { type NextRequest } from "next/server";

function backendBaseUrl(): string {
  const configured = process.env.BACKEND_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return "http://localhost:4000";
}

async function proxyMedia(
  request: NextRequest,
  pathParts: string[],
): Promise<Response> {
  const key = pathParts.map(encodeURIComponent).join("/");
  const target = `${backendBaseUrl()}/media/${key}`;
  const upstream = await fetch(target, {
    method: "GET",
    headers: { Accept: request.headers.get("accept") ?? "*/*" },
    cache: "no-store",
  });

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  const cacheControl = upstream.headers.get("cache-control");
  if (cacheControl) {
    headers.set("Cache-Control", cacheControl);
  } else if (upstream.ok) {
    headers.set("Cache-Control", "public, max-age=86400");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (!path?.length) {
    return new Response("Not found", { status: 404 });
  }
  return proxyMedia(request, path);
}
