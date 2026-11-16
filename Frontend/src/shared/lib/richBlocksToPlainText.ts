import { normalizeRichBlocks } from "@/shared/lib/normalizeRichBlocks";
import { parseListItem } from "@/shared/lib/richListItem";

export function richBlocksToPlainText(blocks: unknown): string {
  return normalizeRichBlocks(blocks)
    .map((block) =>
      block.type === "list"
        ? block.items.map((item) => `• ${parseListItem(item).label}`).join("\n")
        : block.text,
    )
    .join("\n\n");
}
