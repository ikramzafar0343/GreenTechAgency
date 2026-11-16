import type { PublicRichBlock } from "@/shared/lib/normalizeRichBlocks";
import { headingId } from "@/shared/lib/richListItem";

const FACTS_HEADING = "key facts";

export type ArticleOutline = {
  /** Items of the list under a "Key facts" heading, shown as an infobox. */
  facts: readonly string[];
  /** Body without the key-facts heading and list. */
  body: readonly PublicRichBlock[];
  /** H2 headings for the table of contents. */
  toc: readonly { id: string; text: string }[];
};

export function splitArticleBlocks(blocks: readonly PublicRichBlock[]): ArticleOutline {
  const body: PublicRichBlock[] = [];
  let facts: string[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const next = blocks[i + 1];
    if (
      block?.type === "heading" &&
      block.text.trim().toLowerCase() === FACTS_HEADING &&
      next?.type === "list"
    ) {
      facts = next.items;
      i += 1;
      continue;
    }
    if (block) body.push(block);
  }
  const toc = body.flatMap((block) =>
    block.type === "heading" && block.level === 2
      ? [{ id: headingId(block.text), text: block.text }]
      : [],
  );
  return { facts, body, toc };
}
