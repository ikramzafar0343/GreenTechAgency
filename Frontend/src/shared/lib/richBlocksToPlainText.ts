import { normalizeRichBlocks } from "@/shared/lib/normalizeRichBlocks";

export function richBlocksToPlainText(blocks: unknown): string {
  return normalizeRichBlocks(blocks)
    .map((block) => block.text)
    .join("\n\n");
}
