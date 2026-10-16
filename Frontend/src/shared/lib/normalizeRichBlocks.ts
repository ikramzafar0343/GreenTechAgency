export type PublicRichBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string };

function asBlockList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && typeof raw === "object") {
    const blocks = (raw as { blocks?: unknown }).blocks;
    if (Array.isArray(blocks)) {
      return blocks;
    }
  }
  return [];
}

/** Normalize Backend rich docs (and legacy `{ version, blocks }` wrappers) for public render. */
export function normalizeRichBlocks(raw: unknown): PublicRichBlock[] {
  const out: PublicRichBlock[] = [];
  for (const block of asBlockList(raw)) {
    if (!block || typeof block !== "object") {
      continue;
    }
    const row = block as { type?: string; text?: string; level?: number };
    const text = typeof row.text === "string" ? row.text.trim() : "";
    if (!text) {
      continue;
    }
    if (row.type === "heading") {
      out.push({ type: "heading", level: row.level === 3 ? 3 : 2, text });
      continue;
    }
    out.push({ type: "paragraph", text });
  }
  return out;
}
