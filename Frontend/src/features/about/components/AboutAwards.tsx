"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AwardDigitReel } from "@/features/about/components/awards/AwardDigitReel";
import { AwardRow } from "@/features/about/components/awards/AwardRow";
import { useAwardPreviewFollower } from "@/features/about/components/awards/useAwardPreviewFollower";
import styles from "@/features/about/components/awards/aboutAwards.module.css";
import type { AboutAchievementsContent } from "@/features/about/model/aboutPageTypes";

type AboutAwardsProps = {
  content: AboutAchievementsContent;
};

const subscribeNoop = () => () => {};

export function AboutAwards({ content }: AboutAwardsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const portalReady = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  useAwardPreviewFollower({
    rootRef,
    listRef,
    previewRef,
    ready: portalReady,
  });

  if (!content.enabled) return null;

  const rows = [...content.rows]
    .filter((row) => row.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (rows.length === 0) return null;

  const spokenTotal = `${content.actualCount}${content.suffix}`;
  const actionCount = String(content.actualCount);

  const preview = (
    <div ref={previewRef} className={styles.preview} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- follower swaps src via pointer events */}
      <img alt="" width={400} height={560} decoding="async" />
    </div>
  );

  return (
    <section
      ref={rootRef}
      className={styles.section}
      aria-labelledby="about-achievements-heading"
    >
      <div className={styles.strip} aria-hidden="true">
        <span>{content.stripExplore}</span>
        <span className={styles.stripCenter}>{content.stripIndex}</span>
        <span className={styles.stripRight}>{content.stripLabel}</span>
      </div>

      <div className={styles.headingBlock}>
        <div className={styles.headingCopy}>
          <h2 id="about-achievements-heading" className={styles.heading}>
            {content.heading}
          </h2>
          <p className={styles.total}>
            <AwardDigitReel
              value={content.actualCount}
              padLength={3}
              suffix={content.suffix}
              ariaLabel={spokenTotal}
            />
          </p>
        </div>
      </div>

      <ul ref={listRef} className={styles.list}>
        {rows.map((row, index) => (
          <AwardRow key={row.id} row={row} index={index} />
        ))}
      </ul>

      {content.allAwardsHref ? (
        <div className={styles.actionWrap}>
          <div className={styles.actionSlot}>
            <a href={content.allAwardsHref} className={styles.action}>
              <span className={styles.actionLabel}>{content.allAwardsLabel}</span>
              <span className={styles.actionCount} aria-hidden="true">
                ({actionCount})
              </span>
              <span className="sr-only"> ({actionCount})</span>
            </a>
          </div>
        </div>
      ) : null}

      {portalReady ? createPortal(preview, document.body) : null}
    </section>
  );
}
