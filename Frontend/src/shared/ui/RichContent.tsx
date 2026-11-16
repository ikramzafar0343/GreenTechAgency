import { Link } from "@/i18n/navigation";
import type { PublicRichBlock } from "@/shared/lib/normalizeRichBlocks";
import { headingId, parseListItem } from "@/shared/lib/richListItem";

type RichContentProps = {
  readonly idPrefix: string;
  readonly blocks: readonly PublicRichBlock[];
  readonly className?: string;
};

function ListItem({ raw }: { readonly raw: string }) {
  const item = parseListItem(raw);
  if (!item.href) {
    return <li>{item.label}</li>;
  }
  if (item.external) {
    return (
      <li>
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          {item.label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={item.href}>{item.label}</Link>
    </li>
  );
}

/** Renders CMS rich blocks (paragraphs, H2/H3 with anchor ids, plain-text lists). */
export function RichContent({ idPrefix, blocks, className = "typeProse" }: RichContentProps) {
  if (blocks.length === 0) {
    return null;
  }
  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `${idPrefix}-${block.type}-${index}`;
        if (block.type === "heading") {
          const id = headingId(block.text);
          return block.level === 3 ? (
            <h3 key={key} id={id}>
              {block.text}
            </h3>
          ) : (
            <h2 key={key} id={id} className="scroll-mt-28">
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          const items = block.items.map((raw, itemIndex) => (
            <ListItem key={`${key}-${itemIndex}`} raw={raw} />
          ));
          return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
        }
        return <p key={key}>{block.text}</p>;
      })}
    </div>
  );
}
