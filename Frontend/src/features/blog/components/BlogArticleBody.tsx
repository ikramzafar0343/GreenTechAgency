import type { PublicRichBlock } from "@/shared/lib/normalizeRichBlocks";

type BlogArticleBodyProps = {
  readonly articleId: string;
  readonly blocks: readonly PublicRichBlock[];
};

export function BlogArticleBody({ articleId, blocks }: BlogArticleBodyProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="typeProse mt-8 text-white/90">
      {blocks.map((block, index) => {
        const key = `${articleId}-${block.type}-${index}`;
        if (block.type === "heading") {
          if (block.level === 3) {
            return <h3 key={key}>{block.text}</h3>;
          }
          return <h2 key={key}>{block.text}</h2>;
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}
