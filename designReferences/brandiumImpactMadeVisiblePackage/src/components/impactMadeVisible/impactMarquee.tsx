"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { ImpactCard } from "./impactCard";
import type { ImpactCardData } from "./impact.types";
import styles from "./impactMadeVisible.module.css";

interface ImpactMarqueeProps {
  cards: readonly ImpactCardData[];
}

/** Decorative duplicate is aria-hidden, and duplicate links are removed from tab order. */
export function ImpactMarquee({ cards }: ImpactMarqueeProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const shouldRepeat = cards.length > 1;

  useEffect(() => {
    const root = observerTarget.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01, rootMargin: "150px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  if (cards.length === 0) return null;

  // Approximate constant px/sec at screenshot desktop width; CSS owns breakpoint overrides.
  const durationSeconds = Math.max(28, Math.round(cards.length * (459 + 16) / 58));
  const marqueeStyle = {
    "--impactMarqueeDuration": `${durationSeconds}s`,
  } as CSSProperties;

  return (
    <div
      ref={observerTarget}
      className={styles.viewport}
      data-visible={inView ? "true" : "false"}
      data-static={shouldRepeat ? "false" : "true"}
      aria-label="Impact and project results"
      role="region"
      tabIndex={0}
      style={marqueeStyle}
    >
      <div className={styles.track}>
        <div className={styles.group}>
          {cards.map((card) => <ImpactCard key={card.id} card={card} />)}
        </div>
        {shouldRepeat && (
          <div className={`${styles.group} ${styles.repeatGroup}`} aria-hidden="true">
            {cards.map((card) => <ImpactCard key={`repeat-${card.id}`} card={card} isClone />)}
          </div>
        )}
      </div>
    </div>
  );
}
