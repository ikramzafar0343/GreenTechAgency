import { CONTENT_LOCALES, type ContentLocale } from "../db/schema/translations.js";
import { translateFromEnglish } from "../content/translateProvider.js";

export const TARGETS = CONTENT_LOCALES.filter((l) => l !== "en") as ContentLocale[];

export const FORCE = process.env.SEED_FORCE === "1";

export const CONCURRENCY = Number(process.env.SEED_CONCURRENCY || 8);

export const SKIP_KEYS = new Set([
  "id",
  "slug",
  "href",
  "ctaHref",
  "storyCtaHref",
  "videoSrc",
  "posterSrc",
  "cardImagePath",
  "leadImagePath",
  "deliveryRailImagePath",
  "companyLogoUrl",
  "reviewerPhotoUrl",
  "sourceUrl",
  "iconName",
  "eventName",
  "metricType",
  "preset",
  "email",
  "phone",
  "url",
  "src",
  "path",
  "key",
  "locale",
  "type",
  "reviewerName",
  "companyName",
  "clientName",
  "authorDisplay",
  "brandName",
  "copyrightName",
  "logoUrl",
  "platform",
]);

export function sanitizeText(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .normalize("NFC");
}

export function shouldTranslateString(key: string | null, value: string): boolean {
  if (!value.trim()) return false;
  if (key && SKIP_KEYS.has(key)) return false;
  if (/^https?:\/\//i.test(value)) return false;
  if (value.startsWith("/") && !value.includes(" ")) return false;
  if (value.startsWith("greentech:")) return false;
  if (value.startsWith("data:")) return false;
  if (/^[0-9.+%\-–—]+$/.test(value.trim())) return false;
  if (
    /^[a-z0-9_\-./]+$/i.test(value) &&
    value.length < 48 &&
    !value.includes(" ")
  ) {
    if (/\.(png|jpe?g|webp|gif|svg|mp4|webm)$/i.test(value)) return false;
  }
  return true;
}

export function collectStrings(
  value: unknown,
  key: string | null,
  into: Set<string>,
): void {
  if (typeof value === "string") {
    if (shouldTranslateString(key, value)) into.add(sanitizeText(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, null, into);
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      collectStrings(v, k, into);
    }
  }
}

export function applyTranslations(
  value: unknown,
  key: string | null,
  map: Map<string, string>,
): unknown {
  if (typeof value === "string") {
    if (!shouldTranslateString(key, value)) return value;
    return map.get(sanitizeText(value)) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => applyTranslations(item, null, map));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = applyTranslations(v, k, map);
    }
    return out;
  }
  return value;
}

export async function translateText(
  text: string,
  locale: ContentLocale,
): Promise<string> {
  return translateFromEnglish(text, locale);
}

export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      const item = items[i];
      if (item === undefined) continue;
      results[i] = await worker(item, i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  );
  return results;
}

export async function buildLocaleMap(
  strings: string[],
  locale: ContentLocale,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const unique = [...new Set(strings)];
  await mapPool(unique, CONCURRENCY, async (text) => {
    const translated = await translateText(text, locale);
    map.set(text, translated);
    return translated;
  });
  return map;
}
