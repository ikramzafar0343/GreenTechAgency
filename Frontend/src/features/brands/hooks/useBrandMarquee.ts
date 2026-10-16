"use client";

import { useEffect, useRef } from "react";
import { BASE_SPEED } from "@/features/brands/model/brandLogos";

type RowRefs = {
  row: HTMLElement;
  scrollLayer: HTMLElement;
  track: HTMLElement;
  group: HTMLElement;
  baseDirection: 1 | -1;
  phase: number;
  direction: 1 | -1;
  groupWidth: number;
  duration: number;
};

const positiveModulo = (value: number, max: number) => {
  const result = value % max;
  return result < 0 ? result + max : result;
};

const speedMultiplier = (width: number) => {
  if (width < 479) {
    return 0.25;
  }
  if (width < 991) {
    return 0.5;
  }
  return 1;
};

type UseBrandMarqueeOptions = {
  enabled: boolean;
  paused: boolean;
};

export function useBrandMarquee(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: UseBrandMarqueeOptions,
) {
  const rowsRef = useRef<RowRefs[]>([]);
  const pausedRef = useRef(options.paused);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<1 | -1>(1);

  useEffect(() => {
    pausedRef.current = options.paused;
  }, [options.paused]);

  useEffect(() => {
    if (!options.enabled) {
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const rowNodes = Array.from(
      section.querySelectorAll<HTMLElement>("[data-brand-row]"),
    );

    const measure = () => {
      const viewportWidth = window.innerWidth;
      rowsRef.current = rowNodes.map((row, index) => {
        const scrollLayer = row.querySelector<HTMLElement>(
          "[data-brand-scroll-layer]",
        );
        const track = row.querySelector<HTMLElement>("[data-brand-track]");
        const group = row.querySelector<HTMLElement>("[data-brand-group]");
        if (!scrollLayer || !track || !group) {
          throw new Error("Brand marquee markup is incomplete.");
        }

        const groupWidth = group.getBoundingClientRect().width;
        const duration =
          BASE_SPEED * (groupWidth / Math.max(viewportWidth, 1)) * speedMultiplier(viewportWidth);
        const baseDirection = (row.dataset.direction === "-1" ? -1 : 1) as 1 | -1;
        const existing = rowsRef.current[index];

        return {
          row,
          scrollLayer,
          track,
          group,
          baseDirection,
          phase: existing?.phase ?? (index === 0 ? 0.1 : 0.35),
          direction: existing?.direction ?? baseDirection,
          groupWidth,
          duration: Math.max(duration, 1),
        };
      });
    };

    measure();
    lastScrollY.current = window.scrollY;

    let frame = 0;
    let lastTime = performance.now();
    let inView = true;

    const applyTransforms = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      for (const row of rowsRef.current) {
        const rect = row.row.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(
            0,
            (viewportHeight - rect.top) / (viewportHeight + rect.height),
          ),
        );

        const trackX = -row.groupWidth + row.phase * row.groupWidth;
        const scrollX =
          row.baseDirection === 1
            ? (-0.1 + 0.2 * p) * viewportWidth
            : (0.1 - 0.2 * p) * viewportWidth;

        if (!pausedRef.current) {
          row.track.style.transform = `translate3d(${trackX}px, 0, 0)`;
          row.scrollLayer.style.transform = `translate3d(${scrollX}px, 0, 0)`;
        }
      }
    };

    const tick = (now: number) => {
      const elapsed = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!pausedRef.current && inView && !document.hidden) {
        for (const row of rowsRef.current) {
          row.direction =
            scrollDirection.current === 1
              ? row.baseDirection
              : ((-row.baseDirection) as 1 | -1);
          row.phase = positiveModulo(
            row.phase + (row.direction * elapsed) / row.duration,
            1,
          );
        }
        applyTransforms();
      }

      frame = window.requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      if (Math.abs(delta) > 0.5) {
        scrollDirection.current = delta > 0 ? 1 : -1;
      }
      lastScrollY.current = current;
      if (!pausedRef.current) {
        applyTransforms();
      }
    };

    const onResize = () => {
      const progress = rowsRef.current.map((row) => row.phase);
      measure();
      rowsRef.current.forEach((row, index) => {
        const saved = progress[index];
        if (typeof saved === "number") {
          row.phase = saved;
        }
      });
      applyTransforms();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
      },
      { threshold: 0.05 },
    );
    observer.observe(section);

    const onVisibility = () => {
      lastTime = performance.now();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    applyTransforms();
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [options.enabled, sectionRef]);
}
