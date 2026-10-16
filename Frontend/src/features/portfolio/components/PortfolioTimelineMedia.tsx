"use client";

import Image from "next/image";
import type { RefObject } from "react";
import type { PortfolioTimelineStep } from "@/features/portfolio/model/timelineTypes";
import styles from "@/features/portfolio/styles/portfolioTimeline.module.css";

type PortfolioTimelineMediaProps = {
  step: PortfolioTimelineStep;
  layerRef: RefObject<HTMLDivElement | null>;
};

function isCmsMediaSrc(src: string) {
  return (
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.endsWith(".svg")
  );
}

export function PortfolioTimelineMedia({
  step,
  layerRef,
}: PortfolioTimelineMediaProps) {
  return (
    <div className={styles.mediaFrame}>
      <div ref={layerRef} className={styles.mediaLayer}>
        <Image
          key={step.id}
          src={step.imageUrl}
          alt={step.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1099px) 40vw, 420px"
          className={styles.mediaImage}
          priority
          unoptimized={isCmsMediaSrc(step.imageUrl)}
        />
      </div>
    </div>
  );
}
