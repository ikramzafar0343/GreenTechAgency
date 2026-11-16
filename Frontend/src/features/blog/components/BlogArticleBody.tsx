import type { PublicRichBlock } from "@/shared/lib/normalizeRichBlocks";
import { RichContent } from "@/shared/ui/RichContent";

type BlogArticleBodyProps = {
  readonly articleId: string;
  readonly blocks: readonly PublicRichBlock[];
};

export function BlogArticleBody({ articleId, blocks }: BlogArticleBodyProps) {
  return (
    <RichContent
      idPrefix={articleId}
      blocks={blocks}
      className="typeProse mt-10 text-white/85 [&_a]:text-[var(--accent-cyan,#58e2ec)] [&_h2]:text-white [&_h3]:text-white"
    />
  );
}
