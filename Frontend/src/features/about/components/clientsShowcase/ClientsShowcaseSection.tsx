"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ClientNameRail } from "@/features/about/components/clientsShowcase/ClientNameRail";
import { ClientPreviewTile } from "@/features/about/components/clientsShowcase/ClientPreviewTile";
import { ClientQuote } from "@/features/about/components/clientsShowcase/ClientQuote";
import { useClientShowcaseMotion } from "@/features/about/components/clientsShowcase/useClientShowcaseMotion";
import styles from "@/features/about/components/clientsShowcase/clientsShowcase.module.css";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutClientsSectionContent } from "@/features/about/model/aboutPageTypes";

type ClientsShowcaseSectionProps = {
  content: AboutClientsSectionContent;
};

export function ClientsShowcaseSection({ content }: ClientsShowcaseSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const namesRef = useRef<HTMLUListElement>(null);
  const scrollToIndexRef = useRef<((index: number) => void) | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [reduceMotion] = useState(() =>
    typeof window === "undefined" ? false : prefersReducedMotion(),
  );

  const items = useMemo(
    () =>
      [...content.items]
        .filter((item) => item.isPublished)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [content.items],
  );

  const onScrollIndexChange = useCallback((index: number) => {
    setScrollIndex(index);
  }, []);

  const onScrub = useCallback(() => {
    setHoverIndex(null);
  }, []);

  useClientShowcaseMotion({
    rootRef,
    namesRef,
    itemCount: items.length,
    hoverIndex,
    onScrollIndexChange,
    onScrub,
    scrollToIndexRef,
  });

  if (items.length === 0) return null;

  // Logo and active name share scrollIndex from the focus-line measurement.
  // Hover only tints labels while the pin is idle — it never drives the logo.
  const activeItem = items[scrollIndex] ?? items[0] ?? null;
  const highlightIndex = scrollIndex;

  return (
    <section
      ref={rootRef}
      className={styles.clientsShowcase}
      aria-labelledby="clientsHeading"
      data-clients-mode="stack"
    >
      <h2 id="clientsHeading" className="sr-only">
        Selected clients
      </h2>

      <div className={styles.labelStrip} aria-hidden="true">
        <span className={styles.labelLeft}>Discover</span>
        <span className={styles.labelCenter}>03</span>
        <span className={styles.labelRight}>Clients</span>
      </div>

      <div className={styles.pinTrack} data-clients-pin-track>
        <div className={styles.stage} data-clients-stage>
          <ClientPreviewTile item={activeItem} reduceMotion={reduceMotion} />
          <ClientNameRail
            items={items}
            activeIndex={highlightIndex}
            namesRef={namesRef}
            onHoverIndex={setHoverIndex}
            onSelectIndex={(index) => {
              setHoverIndex(null);
              setScrollIndex(index);
              scrollToIndexRef.current?.(index);
            }}
          />
          <ClientQuote content={content} />
        </div>
      </div>
    </section>
  );
}
