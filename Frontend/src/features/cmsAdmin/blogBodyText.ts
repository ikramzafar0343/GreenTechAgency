/**
 * Plain-text body format for the editor:
 *   "## Heading" / "### Sub-heading", "- item" (bullet list), "1. item" (numbered list),
 *   anything else is a paragraph. Blocks are separated by a blank line.
 *   A list item may end with " | https://url" or " | /path" to become a link.
 */
export function paragraphsToText(body: unknown): string {
  if (!Array.isArray(body)) return "";
  return body
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const row = block as { type?: string; text?: string; level?: number; ordered?: boolean; items?: unknown };
      if (row.type === "heading") return `${row.level === 3 ? "###" : "##"} ${row.text ?? ""}`;
      if (row.type === "list" && Array.isArray(row.items)) {
        return row.items
          .map((item, index) => `${row.ordered ? `${index + 1}.` : "-"} ${String(item)}`)
          .join("\n");
      }
      return row.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n");
}

const BULLET = /^-\s+/;
const NUMBERED = /^\d+\.\s+/;

export function textToBody(text: string) {
  return text
    .split(/\n\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("### ")) {
        return { type: "heading" as const, level: 3 as const, text: chunk.slice(4).trim() };
      }
      if (chunk.startsWith("## ")) {
        return { type: "heading" as const, level: 2 as const, text: chunk.slice(3).trim() };
      }
      const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
      const ordered = lines.every((line) => NUMBERED.test(line));
      if (ordered || lines.every((line) => BULLET.test(line))) {
        return {
          type: "list" as const,
          ordered,
          items: lines.map((line) => line.replace(ordered ? NUMBERED : BULLET, "")),
        };
      }
      return { type: "paragraph" as const, text: chunk };
    });
}
