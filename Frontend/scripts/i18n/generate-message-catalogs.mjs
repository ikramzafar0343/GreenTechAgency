/**
 * Deep-translate Frontend/messages/en.json into every non-English locale file.
 * Uses MyMemory (gtx is often blocked for automation).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "../../messages");

const LOCALES = [
  "ar",
  "es",
  "de",
  "fr",
  "fr-CA",
  "it",
  "pt-BR",
  "nl",
  "tr",
  "ur",
  "hi",
  "zh-CN",
  "ja",
  "ko",
  "ru",
  "id",
  "vi",
];

const PROVIDER = {
  ar: "ar",
  es: "es",
  de: "de",
  fr: "fr",
  "fr-CA": "fr",
  it: "it",
  "pt-BR": "pt",
  nl: "nl",
  tr: "tr",
  ur: "ur",
  hi: "hi",
  "zh-CN": "zh-CN",
  ja: "ja",
  ko: "ko",
  ru: "ru",
  id: "id",
  vi: "vi",
};

const cache = new Map();

async function translateText(text, locale) {
  if (!text.trim()) return text;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(text)) return text;
  const key = `${locale}::${text}`;
  if (cache.has(key)) return cache.get(key);

  const tl = PROVIDER[locale] ?? locale;
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text.slice(0, 450));
  url.searchParams.set("langpair", `en|${tl}`);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      cache.set(key, text);
      return text;
    }
    const data = await response.json();
    let translated = data?.responseData?.translatedText?.trim() || text;
    if (/MYMEMORY WARNING/i.test(translated)) translated = text;
    translated = translated.replace(/Green\s*Tech/gi, "GreenTech");
    cache.set(key, translated);
    await new Promise((r) => setTimeout(r, 80));
    return translated;
  } catch {
    cache.set(key, text);
    return text;
  }
}

async function translateTree(value, locale) {
  if (typeof value === "string") return translateText(value, locale);
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await translateTree(item, locale));
    return out;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = await translateTree(v, locale);
    }
    return out;
  }
  return value;
}

const only = process.env.CATALOG_LOCALES?.split(",").map((s) => s.trim()).filter(Boolean);
const targets = only?.length ? LOCALES.filter((l) => only.includes(l)) : LOCALES;
const en = JSON.parse(readFileSync(join(messagesDir, "en.json"), "utf8"));

for (const locale of targets) {
  console.log(`catalog ${locale}…`);
  const tree = await translateTree(en, locale);
  if (tree.seo) tree.seo.siteName = "GreenTech Agency";
  writeFileSync(
    join(messagesDir, `${locale}.json`),
    `${JSON.stringify(tree, null, 2)}\n`,
    "utf8",
  );
}

console.log("Message catalogs generated.");
