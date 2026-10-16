import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { register } from "node:module";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const out = join(root, "Backend/data/import");
const fe = join(root, "Frontend/src/features");

// Use Backend's tsx to load TS via dynamic spawn instead — write JSON manually from known exports.
import { readFileSync } from "node:fs";

function extractConstObject(src, name) {
  const marker = `export const ${name}`;
  const idx = src.indexOf(marker);
  if (idx < 0) throw new Error(`missing ${name}`);
  const start = src.indexOf("{", idx);
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === "{") depth++;
    if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        // not real JSON — just copy with as const stripped for import as JSON via eval
        return src.slice(start, i + 1);
      }
    }
  }
  throw new Error(`unclosed ${name}`);
}

// Prefer running via Frontend package with tsx script file:
console.log("Use export-marketing.ts via tsx instead");
