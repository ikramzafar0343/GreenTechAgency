import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // English-only storefront; leave admin/employee/api alone.
  matcher: ["/", "/((?!api|admin|employee|_next|_vercel|.*\\..*).*)"],
};
