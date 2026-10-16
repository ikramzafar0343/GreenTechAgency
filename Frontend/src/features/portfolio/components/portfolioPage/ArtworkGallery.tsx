"use client";

import { useState } from "react";
import { ArtworkCard } from "@/features/portfolio/components/portfolioPage/ArtworkCard";
import {
  ArtworkLightbox,
  type ArtworkLightboxState,
} from "@/features/portfolio/components/portfolioPage/ArtworkLightbox";
import { PortfolioEmptyState } from "@/features/portfolio/components/portfolioPage/PortfolioEmptyState";
import type { ArtworkProject } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioGalleries.module.css";

type ArtworkGalleryProps = {
  items: readonly ArtworkProject[];
  emptyLabel: string;
};

export function ArtworkGallery({ items, emptyLabel }: ArtworkGalleryProps) {
  const [lightbox, setLightbox] = useState<ArtworkLightboxState>(null);

  if (items.length === 0) {
    return <PortfolioEmptyState categoryLabel={emptyLabel} />;
  }

  return (
    <>
      <div className={styles.artworkGrid}>
        {items.map((project) => (
          <ArtworkCard
            key={project.id}
            project={project}
            onOpen={(opened) => {
              const urls =
                opened.galleryUrls.length > 0
                  ? opened.galleryUrls
                  : [opened.coverUrl];
              setLightbox({ title: opened.title, urls, index: 0 });
            }}
          />
        ))}
      </div>
      <ArtworkLightbox
        state={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={(index) =>
          setLightbox((current) => (current ? { ...current, index } : current))
        }
      />
    </>
  );
}
