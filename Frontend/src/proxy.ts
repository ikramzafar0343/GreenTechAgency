import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const APEX_HOST = "greentechagency.com";
const WWW_HOST = `www.${APEX_HOST}`;

function requestHost(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  return raw
    .split(",")[0]
    ?.trim()
    .toLowerCase()
    .replace(/:\d+$/, "") ?? "";
}

/**
 * Collapse www onto the apex host used by sitemap/canonicals/robots, then run
 * next-intl. Without this Google indexes both hosts as duplicates.
 */
export default function middleware(request: NextRequest) {
  if (requestHost(request) === WWW_HOST) {
    const target = new URL(
      `https://${APEX_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return NextResponse.redirect(target, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // English-only storefront; leave admin/employee/api alone.
  matcher: ["/", "/((?!api|admin|employee|_next|_vercel|.*\\..*).*)"],
};
