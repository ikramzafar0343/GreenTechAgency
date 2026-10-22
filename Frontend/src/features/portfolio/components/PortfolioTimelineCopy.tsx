"use client";

import type { RefObject } from "react";
import { Link } from "@/i18n/navigation";
import type { MarkerSlot } from "@/features/portfolio/lib/curveSlots";
import type { PortfolioTimelineStep } from "@/features/portfolio/model/timelineTypes";
import styles from "@/features/portfolio/styles/portfolioTimeline.module.css";

type PortfolioTimelineCopyProps = {
  previousTitle: string | undefined;
  nextTitle: string | undefined;
  active: PortfolioTimelineStep;
  activeSlot: MarkerSlot;
  lanesRef: RefObject<HTMLDivElement | null>;
};

function ActiveBlock({ step }: { step: PortfolioTimelineStep }) {
  return (
    <div className={styles.activeBlock}>
      <p className={`${styles.timeLabel} typeMeta`}>{step.timeLabel}</p>
      <h3 className={`${styles.activeTitle} typeCardTitle`}>
        <Link href={`/portfolio/${step.slug}`}>{step.title}</Link>
      </h3>
      <p className={`${styles.activeBody} typeBody`}>{step.description}</p>
    </div>
  );
}

function GhostTitle({ title }: { title: string | undefined }) {
  if (!title) {
    return <div className={styles.slotSpacer} aria-hidden="true" />;
  }
  return (
    <p className={`${styles.ghostTitle} typeHeading`} aria-hidden="true">
      {title}
    </p>
  );
}

export function PortfolioTimelineCopy({
  previousTitle,
  nextTitle,
  active,
  activeSlot,
  lanesRef,
}: PortfolioTimelineCopyProps) {
  return (
    <>
      <div className={styles.mobileActive}>
        <ActiveBlock step={active} />
      </div>

      <div ref={lanesRef} className={styles.copyLanes}>
        <div className={styles.slotTop}>
          {activeSlot === "top" ? (
            <ActiveBlock step={active} />
          ) : (
            <GhostTitle title={previousTitle} />
          )}
        </div>

        <div className={styles.slotMid}>
          {activeSlot === "mid" ? (
            <ActiveBlock step={active} />
          ) : activeSlot === "top" ? (
            <GhostTitle title={nextTitle} />
          ) : (
            <div className={styles.slotSpacer} aria-hidden="true" />
          )}
        </div>

        <div className={styles.slotBottom}>
          {activeSlot === "bottom" ? (
            <ActiveBlock step={active} />
          ) : activeSlot === "mid" ? (
            <GhostTitle title={nextTitle} />
          ) : (
            <div className={styles.slotSpacer} aria-hidden="true" />
          )}
        </div>
      </div>
    </>
  );
}
