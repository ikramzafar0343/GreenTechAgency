"use client";

import type { RefObject } from "react";
import type { PortfolioTimelineStep } from "@/features/portfolio/model/timelineTypes";
import styles from "@/features/portfolio/styles/portfolioTimeline.module.css";
import { PlayOnViewSvg } from "@/shared/media/PlayOnViewSvg";

type PortfolioTimelineMediaProps = {
  step: PortfolioTimelineStep;
  layerRef: RefObject<HTMLDivElement | null>;
};

export function PortfolioTimelineMedia({
  step,
  layerRef,
}: PortfolioTimelineMediaProps) {
  return (
    <div className={styles.mediaFrame}>
      <div ref={layerRef} className={styles.mediaLayer}>
        <PlayOnViewSvg
          key={step.id}
          src={step.imageUrl}
          alt={step.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1099px) 40vw, 420px"
          className={styles.mediaImage}
          priority
        />
      </div>
    </div>
  );
}
