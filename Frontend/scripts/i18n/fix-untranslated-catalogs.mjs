/**
 * Re-translate catalog keys that still match English (failed/rate-limited).
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "../../messages");

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

const ALLOW = new Set(["seo.siteName"]);

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, path));
    } else out[path] = v;
  }
  return out;
}

function unflatten(flat) {
  const root = {};
  for (const [path, value] of Object.entries(flat)) {
    const parts = path.split(".");
    let cur = root;
    for (let i = 0; i < parts.length - 1; i++) {
      cur[parts[i]] ??= {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }
  return root;
}

async function translate(text, locale) {
  const tl = PROVIDER[locale] ?? locale;
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", tl);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const response = await fetch(url.toString());
  if (!response.ok) return null;
  const data = await response.json();
  if (!Array.isArray(data?.[0])) return null;
  return (
    data[0].map((p) => (Array.isArray(p) ? p[0] : "")).join("").trim() || null
  );
}

const enFlat = flatten(
  JSON.parse(readFileSync(join(messagesDir, "en.json"), "utf8")),
);
const files = readdirSync(messagesDir).filter(
  (f) => f.endsWith(".json") && f !== "en.json",
);

for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const flat = flatten(
    JSON.parse(readFileSync(join(messagesDir, file), "utf8")),
  );
  let fixed = 0;
  for (const [key, enVal] of Object.entries(enFlat)) {
    if (ALLOW.has(key)) continue;
    if (typeof enVal !== "string" || enVal.length < 8) continue;
    if (flat[key] !== enVal) continue;
    const next = await translate(enVal, locale);
    await new Promise((r) => setTimeout(r, 40));
    if (next && next !== enVal) {
      flat[key] = next.replace(/Green\s*Tech/gi, "GreenTech");
      fixed++;
    }
  }
  if (flat["seo.siteName"]) flat["seo.siteName"] = "GreenTech Agency";
  writeFileSync(
    join(messagesDir, file),
    `${JSON.stringify(unflatten(flat), null, 2)}\n`,
    "utf8",
  );
  console.log(`${locale}: fixed ${fixed}`);
}
