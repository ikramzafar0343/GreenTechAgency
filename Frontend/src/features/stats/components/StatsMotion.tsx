"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PublicStatMetric } from "@/features/stats/model/types";
import {
  formatMetricValue,
  splitCountDisplay,
} from "@/features/stats/model/formatMetric";

type StatsMotionProps = {
  metrics: PublicStatMetric[];
  entryAnimationEnabled: boolean;
  countUpEnabled: boolean;
};

export function StatsMotion({
  metrics,
  entryAnimationEnabled,
  countUpEnabled,
}: StatsMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const section = root.closest("[data-stats-section]");
    if (!(section instanceof HTMLElement)) {
      return;
    }

    const intro = section.querySelector<HTMLElement>("[data-stats-intro]");
    const backdrop = section.querySelector<HTMLElement>("[data-stats-backdrop]");
    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-stat-card]"),
    );
    if (cards.length === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const floatTweens: gsap.core.Tween[] = [];

    const startVerticalDrift = () => {
      cards.forEach((card, index) => {
        const distance = index % 2 === 0 ? -12 : 12;
        const tween = gsap.to(card, {
          y: distance,
          duration: 4.5 + index * 0.55,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.4,
        });
        floatTweens.push(tween);
      });
    };

    if (reduceMotion) {
      gsap.set([intro, backdrop, ...cards].filter(Boolean), {
        clearProps: "all",
        opacity: 1,
        y: 0,
      });
      return;
    }

    if (!entryAnimationEnabled) {
      gsap.set([intro, backdrop, ...cards].filter(Boolean), {
        opacity: 1,
        y: 0,
      });
      startVerticalDrift();
      return () => {
        floatTweens.forEach((tween) => tween.kill());
      };
    }

    gsap.registerPlugin(ScrollTrigger);
    if (intro) {
      gsap.set(intro, { opacity: 0, y: 20 });
    }
    if (backdrop) {
      gsap.set(backdrop, { opacity: 0 });
    }
    gsap.set(cards, { opacity: 0, y: 28 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        once: true,
      },
    });

    if (backdrop) {
      timeline.to(
        backdrop,
        { opacity: 1, duration: 0.8, ease: "power1.out" },
        0,
      );
    }

    if (intro) {
      timeline.to(
        intro,
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
        0.05,
      );
    }

    timeline.to(
      cards,
      {
        opacity: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.1,
        ease: "power2.out",
        onStart: () => {
          if (!countUpEnabled) {
            return;
          }
          for (const metric of metrics) {
            if (metric.metricType !== "COUNT") {
              continue;
            }
            const node = section.querySelector<HTMLElement>(
              `[data-stat-count="${metric.id}"]`,
            );
            if (!node) {
              continue;
            }
            animateCount(node, metric);
          }
        },
      },
      0.18,
    );

    timeline.add(() => {
      startVerticalDrift();
    });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      floatTweens.forEach((tween) => tween.kill());
    };
  }, [metrics, entryAnimationEnabled, countUpEnabled]);

  return <div ref={rootRef} hidden aria-hidden="true" />;
}

function animateCount(node: HTMLElement, metric: PublicStatMetric) {
  const state = { value: 0 };
  const usesSplitSuffix =
    metric.preset === "OVERSIZED_NUMBER" && Boolean(metric.suffix);

  gsap.to(state, {
    value: metric.value,
    duration: 1.15,
    ease: "power1.out",
    onUpdate: () => {
      const rounded = Math.round(state.value);
      if (usesSplitSuffix) {
        node.textContent = new Intl.NumberFormat("en-US").format(rounded);
        return;
      }
      node.textContent = `${metric.prefix ?? ""}${new Intl.NumberFormat("en-US").format(rounded)}${metric.suffix ?? ""}`;
    },
    onComplete: () => {
      if (usesSplitSuffix) {
        node.textContent = splitCountDisplay(metric).main;
        return;
      }
      node.textContent = formatMetricValue(metric);
    },
  });
}
