/** Official public origin for sitemap, canonicals, OG, and JSON-LD. */
export const DEFAULT_SITE_URL = "https://greentechagency.com";

/**
 * Resolve the absolute site origin (no trailing slash).
 * Prefer NEXT_PUBLIC_SITE_URL, then NEXT_PUBLIC_APP_URL, then .com default.
 * Never falls back to greentech.agency.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const url = new URL(value);
      return `${url.protocol}//${url.host}`;
    } catch {
      /* ignore invalid */
    }
  }
  return DEFAULT_SITE_URL;
}

/** Absolute URL for a site path (leading slash optional). */
export function absoluteUrl(path = "/"): string {
  const origin = getSiteUrl();
  if (!path || path === "/") return `${origin}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
