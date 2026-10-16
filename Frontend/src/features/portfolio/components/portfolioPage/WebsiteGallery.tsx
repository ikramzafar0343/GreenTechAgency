"use client";

import { useRef, useState, useTransition } from "react";
import { WebsiteCard } from "@/features/portfolio/components/portfolioPage/WebsiteCard";
import { PortfolioEmptyState } from "@/features/portfolio/components/portfolioPage/PortfolioEmptyState";
import type { WebsiteProject } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";

const INITIAL_COUNT = 12;
const PAGE_SIZE = 8;

type WebsiteGalleryProps = {
  items: readonly WebsiteProject[];
};

export function WebsiteGallery({ items }: WebsiteGalleryProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isPending, startTransition] = useTransition();
  const loadingRef = useRef(false);

  if (items.length === 0) {
    return <PortfolioEmptyState categoryLabel="Websites" />;
  }

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  function onSeeMore() {
    if (loadingRef.current || !hasMore) {
      return;
    }
    loadingRef.current = true;
    startTransition(() => {
      setVisibleCount((count) => Math.min(count + PAGE_SIZE, items.length));
      loadingRef.current = false;
    });
  }

  return (
    <>
      <div className={styles.websiteGrid}>
        {visible.map((project, index) => (
          <WebsiteCard
            key={project.id}
            project={project}
            reveal={index >= INITIAL_COUNT}
          />
        ))}
      </div>
      {hasMore ? (
        <div className={styles.loadMoreWrap}>
          <button
            type="button"
            className={`${styles.loadMore} typeButton`}
            onClick={onSeeMore}
            disabled={isPending}
          >
            See More
          </button>
        </div>
      ) : null}
    </>
  );
}
