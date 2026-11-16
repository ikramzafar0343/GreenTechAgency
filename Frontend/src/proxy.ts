import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

/**
 * Next binds 127.0.0.1 and then rewrites the locale URL as https://localhost:PORT.
 * Those origins do not match, so the rewrite is fetched as an external HTTPS URL
 * and Nginx returns 500. Keep loopback rewrites and redirects on the path only.
 */
function loopbackPath(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function proxy(request: NextRequest) {
  const response = handleI18n(request);

  for (const header of ["x-middleware-rewrite", "location"] as const) {
    const value = response.headers.get(header);
    if (!value) continue;
    const path = loopbackPath(value);
    if (path) response.headers.set(header, path);
  }

  return response;
}

export const config = {
  // English-only storefront; leave admin/employee/api alone.
  matcher: ["/", "/((?!api|admin|employee|_next|_vercel|.*\\..*).*)"],
};
