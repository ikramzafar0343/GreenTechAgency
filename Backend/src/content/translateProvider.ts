/**
 * Server-only translation provider adapter.
 * Prefer TRANSLATE_PROVIDER=mymemory|libre|gtx (default: mymemory).
 */
export type TranslateLocaleCode = string;

function sanitizeText(text: string): string {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .normalize("NFC");
}

async function translateMyMemory(
  text: string,
  tl: string,
): Promise<string | null> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text.slice(0, 450));
  url.searchParams.set("langpair", `en|${tl}`);
  const response = await fetch(url.toString());
  if (!response.ok) return null;
  const data = (await response.json()) as {
    responseData?: { translatedText?: string };
    responseStatus?: number;
  };
  const out = data.responseData?.translatedText?.trim();
  if (!out) return null;
  // MyMemory returns the query itself when daily limit is hit.
  if (out.toUpperCase() === text.toUpperCase() && text.length > 20) {
    return null;
  }
  if (/MYMEMORY WARNING/i.test(out)) return null;
  return sanitizeText(out);
}

async function translateLibre(
  text: string,
  tl: string,
): Promise<string | null> {
  const endpoint =
    process.env.LIBRETRANSLATE_URL?.trim() ||
    "https://libretranslate.com/translate";
  const body: Record<string, unknown> = {
    q: text,
    source: "en",
    target: tl,
    format: "text",
  };
  if (process.env.LIBRETRANSLATE_API_KEY) {
    body.api_key = process.env.LIBRETRANSLATE_API_KEY;
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as { translatedText?: string };
  const out = data.translatedText?.trim();
  return out ? sanitizeText(out) : null;
}

async function translateGtx(text: string, tl: string): Promise<string | null> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", tl);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const response = await fetch(url.toString());
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok || !contentType.includes("json")) return null;
  const data = (await response.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) return null;
  const out = sanitizeText(
    data[0]
      .map((part) =>
        Array.isArray(part) && typeof part[0] === "string" ? part[0] : "",
      )
      .join("")
      .trim(),
  );
  return out || null;
}

/** Map BCP-47 app locales to provider language codes. */
export function providerLanguageCode(locale: string): string {
  const map: Record<string, string> = {
    "fr-CA": "fr",
    "pt-BR": "pt",
    "zh-CN": "zh-CN",
  };
  return map[locale] ?? locale;
}

export async function translateFromEnglish(
  text: string,
  locale: TranslateLocaleCode,
): Promise<string> {
  const clean = sanitizeText(text);
  if (!clean.trim()) return clean;
  const tl = providerLanguageCode(locale);
  const preferred = (process.env.TRANSLATE_PROVIDER || "mymemory").toLowerCase();
  const order =
    preferred === "libre"
      ? [translateLibre, translateMyMemory, translateGtx]
      : preferred === "gtx"
        ? [translateGtx, translateMyMemory, translateLibre]
        : [translateMyMemory, translateLibre, translateGtx];

  for (const fn of order) {
    try {
      const out = await fn(clean, tl);
      if (!out) continue;
      const normalized = out.replace(/Green\s*Tech/gi, "GreenTech");
      // Reject silent English echo — treat as provider failure for non-English targets.
      if (
        locale !== "en" &&
        clean.length > 8 &&
        normalized.localeCompare(clean, undefined, { sensitivity: "accent" }) ===
          0
      ) {
        continue;
      }
      return normalized;
    } catch {
      /* try next */
    }
  }
  // Last resort: keep source but mark clearly in logs for seed tooling.
  console.warn(
    `[translate] no provider produced a distinct ${locale} string for: ${clean.slice(0, 80)}`,
  );
  return clean;
}
