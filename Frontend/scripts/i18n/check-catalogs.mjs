/**
 * Fail if any enabled locale catalog is missing keys or copies English verbatim
 * without an allowlist entry.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const messagesDir = join(__dirname, "../../messages");

const ALLOW_SAME_AS_EN = new Set([
  "seo.siteName",
  "navigation.primary",
  "navigation.mobile",
  "footer.copyright", // © {year}. {name}. — format invariant
]);

function flatten(obj, prefix = "") {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, path));
    } else {
      out[path] = v;
    }
  }
  return out;
}

const en = flatten(JSON.parse(readFileSync(join(messagesDir, "en.json"), "utf8")));
/** Optional: CATALOG_CHECK_LOCALES=es,ar,de,fr,fr-CA */
const only = process.env.CATALOG_CHECK_LOCALES?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const files = readdirSync(messagesDir).filter((f) => {
  if (!f.endsWith(".json") || f === "en.json") return false;
  if (!only?.length) return true;
  return only.includes(f.replace(/\.json$/, ""));
});

let failed = false;
for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const catalog = flatten(
    JSON.parse(readFileSync(join(messagesDir, file), "utf8")),
  );
  for (const key of Object.keys(en)) {
    if (!(key in catalog)) {
      console.error(`[${locale}] missing key: ${key}`);
      failed = true;
      continue;
    }
    const value = catalog[key];
    if (typeof value !== "string" || !value.trim()) {
      console.error(`[${locale}] blank: ${key}`);
      failed = true;
      continue;
    }
    if (
      value === en[key] &&
      !ALLOW_SAME_AS_EN.has(key) &&
      /[A-Za-z]{3,}/.test(String(en[key]))
    ) {
      // Allow short tokens / brand-adjacent sameness for a few UI chips.
      if (String(en[key]).length > 12) {
        console.error(`[${locale}] untranslated (same as en): ${key}`);
        failed = true;
      }
    }
  }
}

if (failed) {
  process.exit(1);
}
console.log(`Catalog parity OK for ${files.length} locales (${Object.keys(en).length} keys).`);
