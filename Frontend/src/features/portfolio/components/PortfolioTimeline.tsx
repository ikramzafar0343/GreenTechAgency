"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import gsap from "gsap";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PortfolioTimelineCopy } from "@/features/portfolio/components/PortfolioTimelineCopy";
import { PortfolioTimelineCurve } from "@/features/portfolio/components/PortfolioTimelineCurve";
import { PortfolioTimelineMedia } from "@/features/portfolio/components/PortfolioTimelineMedia";
import { planCurveSlots } from "@/features/portfolio/lib/curveSlots";
import type { PortfolioTimelineStep } from "@/features/portfolio/model/timelineTypes";
import styles from "@/features/portfolio/styles/portfolioTimeline.module.css";

const EASE = "power3.out";
const OUT_DURATION = 0.26;
const IN_DURATION = 0.48;
const LANE_TRAVEL = 28;
const MEDIA_TRAVEL = 8;
const SWIPE_THRESHOLD = 48;

type PortfolioTimelineProps = {
  steps: PortfolioTimelineStep[];
};

export function PortfolioTimeline({ steps }: PortfolioTimelineProps) {
  const [index, setIndex] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);
  const lanesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const animatingRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const total = steps.length;
  const active = steps[index] ?? steps[0];
  const previous = index > 0 ? steps[index - 1] : undefined;
  const next = index < total - 1 ? steps[index + 1] : undefined;
  const plan = planCurveSlots(index, total);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const runTransition = (fromIndex: number, toIndex: number) => {
    const direction: 1 | -1 = toIndex > fromIndex ? 1 : -1;
    const media = mediaRef.current;
    const lanes = lanesRef.current;

    if (reduceMotionRef.current || !media || !lanes) {
      setIndex(toIndex);
      animatingRef.current = false;
      pendingRef.current = null;
      return;
    }

    animatingRef.current = true;
    timelineRef.current?.kill();

    const yOut = direction > 0 ? -LANE_TRAVEL : LANE_TRAVEL;
    const yIn = direction > 0 ? LANE_TRAVEL : -LANE_TRAVEL;
    const xOut = direction > 0 ? -MEDIA_TRAVEL : MEDIA_TRAVEL;

    const tl = gsap.timeline({
      defaults: { ease: EASE, force3D: true },
      onComplete: () => {
        animatingRef.current = false;
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending != null && pending !== indexRef.current) {
          runTransition(indexRef.current, pending);
        }
      },
    });
    timelineRef.current = tl;

    tl.to(media, { opacity: 0, x: xOut, duration: OUT_DURATION }, 0);
    tl.to(lanes, { opacity: 0, y: yOut, duration: OUT_DURATION }, 0);
    tl.add(() => {
      setIndex(toIndex);
    });
    tl.set(media, { x: -xOut * 0.35, scale: 1.02, opacity: 0 });
    tl.set(lanes, { y: yIn, opacity: 0 });
    tl.to(media, { opacity: 1, x: 0, scale: 1, duration: IN_DURATION }, "-=0.02");
    tl.to(lanes, { opacity: 1, y: 0, duration: IN_DURATION }, "<0.03");
  };

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= total || nextIndex === indexRef.current) {
      return;
    }

    if (animatingRef.current) {
      pendingRef.current = nextIndex;
      return;
    }

    runTransition(indexRef.current, nextIndex);
  };

  const onPrev = () => goTo(indexRef.current - 1);
  const onNext = () => goTo(indexRef.current + 1);

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX == null || endX == null) {
      return;
    }
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }
    if (delta < 0) {
      onNext();
    } else {
      onPrev();
    }
  };

  if (!active) {
    return null;
  }

  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <div
      className={styles.timeline}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.stage}>
        <PortfolioTimelineMedia step={active} layerRef={mediaRef} />

        <div className={styles.rail}>
          <PortfolioTimelineCurve plan={plan} markerKey={active.id} />
          <div className={styles.copyColumn}>
            <PortfolioTimelineCopy
              previousTitle={previous?.title}
              nextTitle={next?.title}
              active={active}
              activeSlot={plan.activeSlot}
              lanesRef={lanesRef}
            />
          </div>
        </div>
      </div>

      {total > 1 ? (
        <nav className={styles.navigation} aria-label="Project steps">
          <button
            type="button"
            className={styles.navButton}
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous project"
          >
            <FiChevronLeft size={20} aria-hidden />
          </button>
          <p className={`${styles.counter} typeMeta`} aria-hidden="true">
            {index + 1} / {total}
          </p>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonAccent}`}
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next project"
          >
            <FiChevronRight size={20} aria-hidden />
          </button>
        </nav>
      ) : null}

      <p className={styles.liveRegion} aria-live="polite" aria-atomic="true">
        {`Step ${index + 1} of ${total}: ${active.title}`}
      </p>
    </div>
  );
}
