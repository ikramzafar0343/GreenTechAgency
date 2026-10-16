"use client";

import gsap from "gsap";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  distance,
  isFarEnough,
  sampleSegmentAtFixedIntervals,
} from "@/ui/components/interactive/mouseTrailMath";
import type {
  TrailCardModel,
  TrailPoint,
} from "@/ui/components/interactive/mouseTrailTypes";

const ENTRY_GATE_PX = 30;

type ControllerOptions = {
  overlayRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  images: readonly string[];
  spawnDistance: number;
  minSeparation: number;
  maxVisibleImages: number;
  imageLifetimeMs: number;
  exitDuration: number;
  pointerLeaveExitDuration: number;
  exitEase: string;
  exitBlur: number;
  idleDelayMs: number;
  duration: number;
  ease: string;
  stagger: number;
};

export function useMouseTrailController({
  overlayRef,
  enabled,
  images,
  spawnDistance,
  minSeparation,
  maxVisibleImages,
  imageLifetimeMs,
  exitDuration,
  pointerLeaveExitDuration,
  exitEase,
  exitBlur,
  idleDelayMs,
  duration,
  ease,
  stagger,
}: ControllerOptions) {
  const [cards, setCards] = useState<TrailCardModel[]>([]);
  const cardsRef = useRef<TrailCardModel[]>([]);
  const lastPointRef = useRef<TrailPoint | null>(null);
  const pathDistanceRef = useRef(0);
  const entryDistanceRef = useRef(0);
  const hasStartedRef = useRef(false);
  const imageIndexRef = useRef(0);
  const nextIdRef = useRef(0);
  const exitTimersRef = useRef<Map<number, number>>(new Map());
  const innerNodesRef = useRef<Map<number, HTMLElement>>(new Map());
  const idleTimerRef = useRef<number | null>(null);
  const isClearingRef = useRef(false);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const section = overlay?.parentElement;
    if (!overlay || !section || !enabled || images.length === 0) {
      return;
    }

    const blurFilter = exitBlur > 0 ? `blur(${exitBlur}px)` : "blur(0px)";

    const clearIdleTimer = () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    };

    const clearLifetimeTimers = () => {
      for (const timer of exitTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      exitTimersRef.current.clear();
    };

    const fadeTrailOut = (fadeDuration: number, resetTracking: boolean) => {
      clearIdleTimer();
      clearLifetimeTimers();
      isClearingRef.current = true;

      if (resetTracking) {
        lastPointRef.current = null;
        pathDistanceRef.current = 0;
        entryDistanceRef.current = 0;
        hasStartedRef.current = false;
      }

      // Newest → oldest so the last spawned card fades first.
      const nodes = [...cardsRef.current]
        .reverse()
        .map((card) => innerNodesRef.current.get(card.id))
        .filter((node): node is HTMLElement => Boolean(node));

      if (nodes.length === 0) {
        setCards([]);
        isClearingRef.current = false;
        return;
      }

      gsap.killTweensOf(nodes);
      gsap.to(nodes, {
        autoAlpha: 0,
        scale: 0.97,
        filter: blurFilter,
        duration: fadeDuration,
        ease: exitEase,
        stagger: 0.1,
        overwrite: true,
        onComplete: () => {
          setCards([]);
          innerNodesRef.current.clear();
          isClearingRef.current = false;
        },
      });
    };

    const armIdleFade = () => {
      if (idleDelayMs <= 0) return;
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(() => {
        fadeTrailOut(exitDuration, false);
      }, idleDelayMs);
    };

    const scheduleExit = (id: number) => {
      const existing = exitTimersRef.current.get(id);
      if (existing) window.clearTimeout(existing);

      const timer = window.setTimeout(() => {
        if (isClearingRef.current) return;
        const node = innerNodesRef.current.get(id);
        if (!node) {
          setCards((prev) => prev.filter((card) => card.id !== id));
          return;
        }
        gsap.fromTo(
          node,
          { filter: "blur(0px)" },
          {
            autoAlpha: 0,
            scale: 0.97,
            filter: blurFilter,
            duration: exitDuration,
            ease: exitEase,
            overwrite: true,
            onComplete: () => {
              setCards((prev) => prev.filter((card) => card.id !== id));
              innerNodesRef.current.delete(id);
              exitTimersRef.current.delete(id);
            },
          },
        );
      }, imageLifetimeMs);

      exitTimersRef.current.set(id, timer);
    };

    const spawnCardAtFixedAnchor = (point: TrailPoint) => {
      if (isClearingRef.current) {
        gsap.killTweensOf(Array.from(innerNodesRef.current.values()));
        isClearingRef.current = false;
      }

      const visibleCenters = cardsRef.current.map((card) => ({
        x: card.x,
        y: card.y,
      }));
      if (!isFarEnough(point, visibleCenters, minSeparation)) {
        return;
      }

      const src = images[imageIndexRef.current % images.length];
      if (!src) return;
      imageIndexRef.current += 1;

      const id = nextIdRef.current++;
      const rotate = ((id % 5) - 2) * 2.2;
      const next: TrailCardModel = { id, src, x: point.x, y: point.y, rotate };
      setCards((prev) => [...prev.slice(-(maxVisibleImages - 1)), next]);

      requestAnimationFrame(() => {
        const node = innerNodesRef.current.get(id);
        if (!node) return;
        gsap.fromTo(
          node,
          { autoAlpha: 0, scale: 0.86, y: 16, filter: "blur(0px)" },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration,
            ease,
            delay: stagger,
            overwrite: true,
          },
        );
        scheduleExit(id);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };

      armIdleFade();

      const last = lastPointRef.current;
      if (!last) {
        lastPointRef.current = point;
        return;
      }

      const segmentLength = distance(last, point);
      if (segmentLength < 0.5) {
        lastPointRef.current = point;
        return;
      }

      if (!hasStartedRef.current) {
        entryDistanceRef.current += segmentLength;
        lastPointRef.current = point;
        if (entryDistanceRef.current < ENTRY_GATE_PX) return;
        hasStartedRef.current = true;
        spawnCardAtFixedAnchor(point);
        pathDistanceRef.current = 0;
        return;
      }

      pathDistanceRef.current = sampleSegmentAtFixedIntervals(
        last,
        point,
        segmentLength,
        pathDistanceRef.current,
        spawnDistance,
        spawnCardAtFixedAnchor,
      );
      lastPointRef.current = point;
    };

    const onPointerLeave = () => {
      fadeTrailOut(pointerLeaveExitDuration, true);
    };

    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);

    const exitTimers = exitTimersRef.current;
    const innerNodes = innerNodesRef.current;

    return () => {
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      clearIdleTimer();
      for (const timer of exitTimers.values()) window.clearTimeout(timer);
      exitTimers.clear();
      gsap.killTweensOf(Array.from(innerNodes.values()));
      innerNodes.clear();
      setCards([]);
    };
  }, [
    overlayRef,
    enabled,
    images,
    spawnDistance,
    minSeparation,
    maxVisibleImages,
    imageLifetimeMs,
    exitDuration,
    pointerLeaveExitDuration,
    exitEase,
    exitBlur,
    idleDelayMs,
    duration,
    ease,
    stagger,
  ]);

  return { cards, innerNodesRef };
}
