"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ImpactCard } from "@/features/impact/components/ImpactCard";
import type { ImpactCardData } from "@/features/impact/model/impactTypes";
import styles from "@/features/impact/styles/impactMadeVisible.module.css";

type ImpactMarqueeProps = {
  cards: readonly ImpactCardData[];
};

export function ImpactMarquee({ cards }: ImpactMarqueeProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const shouldRepeat = cards.length > 1;

  useEffect(() => {
    const root = observerTarget.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.01, rootMargin: "150px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  if (cards.length === 0) {
    return null;
  }

  const durationSeconds = Math.max(
    28,
    Math.round((cards.length * (459 + 16)) / 58),
  );
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
          {cards.map((card) => (
            <ImpactCard key={card.id} card={card} />
          ))}
        </div>
        {shouldRepeat ? (
          <div
            className={`${styles.group} ${styles.repeatGroup}`}
            aria-hidden="true"
          >
            {cards.map((card) => (
              <ImpactCard
                key={`repeat-${card.id}`}
                card={card}
                isClone
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
