"use client";

import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { ServiceSlide } from "@/features/services/components/ServiceSlide";
import { useServiceCarousel } from "@/features/services/hooks/useServiceCarousel";
import type { ServiceShowcaseEntry } from "@/features/services/model/servicesHubTypes";
import styles from "@/features/services/styles/serviceStage.module.css";

type ServiceGroupCarouselProps = {
  groupId: string;
  outlineLabel: string;
  outlineActive: boolean;
  entries: readonly ServiceShowcaseEntry[];
  stageRevealed: boolean;
  reduceMotion: boolean;
  groupVisible: boolean;
};

export function ServiceGroupCarousel({
  groupId,
  outlineLabel,
  outlineActive,
  entries,
  stageRevealed,
  reduceMotion,
  groupVisible,
}: ServiceGroupCarouselProps) {
  const total = entries.length;
  const {
    index,
    autoplay,
    goTo,
    onTouchStart,
    onTouchEnd,
    pauseAutoplay,
    resumeAutoplay,
  } = useServiceCarousel({
    total,
    groupVisible: groupVisible && stageRevealed,
    reduceMotion,
  });

  if (total === 0) {
    return null;
  }

  const progress = total > 0 ? (index + 1) / total : 0;
  const showControls = total > 1;

  return (
    <div
      className={styles.stage}
      data-stage-revealed={stageRevealed ? "true" : "false"}
      data-outline-active={outlineActive ? "true" : "false"}
      onTouchStart={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a,button")) {
          return;
        }
        onTouchStart(event.changedTouches[0]?.clientX ?? 0);
      }}
      onTouchEnd={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a,button")) {
          return;
        }
        onTouchEnd(event.changedTouches[0]?.clientX ?? 0);
      }}
    >
      <div className={styles.stagePanels}>
        <div className={styles.outlineTrack} aria-hidden="true">
          <p className={`${styles.outline} typeDisplay`}>{outlineLabel}</p>
        </div>
        <div className={styles.panelGrid}>
          {entries.map((entry, entryIndex) => (
            <ServiceSlide
              key={entry.id}
              entry={entry}
              tileTitle={outlineLabel}
              active={entryIndex === index}
              id={`${groupId}-${entry.id}`}
              reduceMotion={reduceMotion}
              wipeNonce={entryIndex === index ? index : -1}
            />
          ))}
        </div>
      </div>

      {showControls ? (
        <div className={styles.controls}>
          <div className={styles.controlRow}>
            <button
              type="button"
              className={styles.navButton}
              aria-label={`Previous ${groupId} service`}
              onClick={() => goTo(index - 1)}
            >
              <FiChevronLeft size={20} aria-hidden />
            </button>
            <p className={`${styles.counter} typeMeta`} aria-live="polite">
              {index + 1} / {total}
            </p>
            <button
              type="button"
              className={styles.navButton}
              aria-label={`Next ${groupId} service`}
              onClick={() => goTo(index + 1)}
            >
              <FiChevronRight size={20} aria-hidden />
            </button>
            {!reduceMotion ? (
              <button
                type="button"
                className={styles.playButton}
                aria-label={
                  autoplay
                    ? `Pause ${groupId} autoplay`
                    : `Play ${groupId} autoplay`
                }
                onClick={() => {
                  if (autoplay) {
                    pauseAutoplay();
                  } else {
                    resumeAutoplay();
                  }
                }}
              >
                {autoplay ? (
                  <FiPause size={16} aria-hidden />
                ) : (
                  <FiPlay size={16} aria-hidden />
                )}
              </button>
            ) : null}
          </div>
          <div className={styles.progress} aria-hidden="true">
            <div
              className={styles.progressFill}
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
