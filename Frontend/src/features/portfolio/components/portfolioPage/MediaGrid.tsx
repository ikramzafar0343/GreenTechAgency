import Image from "next/image";
import { PortfolioEmptyState } from "@/features/portfolio/components/portfolioPage/PortfolioEmptyState";
import type { MediaTile } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";

type MediaGridVariant = "business" | "photography" | "print";

type MediaGridProps = {
  items: readonly MediaTile[];
  variant: MediaGridVariant;
  emptyLabel: string;
};

function variantClass(variant: MediaGridVariant): string {
  switch (variant) {
    case "business":
      return styles.mediaGridBusiness ?? "";
    case "photography":
      return styles.mediaGridPhoto ?? "";
    case "print":
      return styles.mediaGridPrint ?? "";
  }
}

function isCmsMediaSrc(src: string) {
  return (
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.endsWith(".svg")
  );
}

export function MediaGrid({ items, variant, emptyLabel }: MediaGridProps) {
  if (items.length === 0) {
    return <PortfolioEmptyState categoryLabel={emptyLabel} />;
  }

  return (
    <div className={`${styles.mediaGrid} ${variantClass(variant)}`}>
      {items.map((tile) => (
        <figure id={tile.id} key={tile.id} className={styles.mediaTile}>
          <Image
            src={tile.src}
            alt={tile.alt}
            width={tile.width}
            height={tile.height}
            className={styles.mediaImage}
            sizes={
              variant === "business"
                ? "(max-width: 550px) 100vw, 50vw"
                : "(max-width: 550px) 100vw, (max-width: 850px) 50vw, 33vw"
            }
            unoptimized={isCmsMediaSrc(tile.src)}
          />
        </figure>
      ))}
    </div>
  );
}
