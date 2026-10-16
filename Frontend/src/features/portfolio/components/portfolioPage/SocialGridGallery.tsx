"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { PortfolioEmptyState } from "@/features/portfolio/components/portfolioPage/PortfolioEmptyState";
import type { SocialGridCampaign } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";

const INITIAL_COUNT = 12;
const PAGE_SIZE = 12;

type SocialGridGalleryProps = {
  items: readonly SocialGridCampaign[];
};

export function SocialGridGallery({ items }: SocialGridGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [fading, setFading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loadingRef = useRef(false);

  if (items.length === 0) {
    return <PortfolioEmptyState categoryLabel="Social Grid" />;
  }

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  function onSeeMore() {
    if (loadingRef.current || !hasMore) {
      return;
    }
    loadingRef.current = true;
    setFading(true);
    window.setTimeout(() => {
      startTransition(() => {
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, items.length));
        setFading(false);
        loadingRef.current = false;
      });
    }, 200);
  }

  return (
    <>
      <div
        className={`${styles.socialGrid}${fading ? ` ${styles.socialGridFading}` : ""}`}
      >
        {visible.map((campaign) => (
          <article key={campaign.id} className={styles.campaign} aria-label={campaign.title}>
            {campaign.tiles.map((tile) => (
              <div key={tile.id} className={styles.campaignTile}>
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  width={tile.width}
                  height={tile.height}
                  className={styles.campaignImage}
                  sizes="(max-width: 550px) 100vw, 20vw"
                />
              </div>
            ))}
          </article>
        ))}
      </div>
      {hasMore ? (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={`${styles.loadMore} typeButton`}
            onClick={onSeeMore}
            disabled={isPending || fading}
          >
            See More
          </button>
        </div>
      ) : null}
    </>
  );
}
