"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import styles from "@/ui/components/interactive/MouseTrail.module.css";
import type { MouseTrailProps } from "@/ui/components/interactive/mouseTrailTypes";
import { useMouseTrailController } from "@/ui/components/interactive/useMouseTrailController";

const DEFAULT_SPAWN_DISTANCE = 100;
const DEFAULT_MIN_SEPARATION = 80;
const DEFAULT_MAX_VISIBLE = 8;
const DEFAULT_LIFETIME_MS = 1000;
const DEFAULT_EXIT_DURATION = 0.3;
const DEFAULT_POINTER_LEAVE_EXIT = 0.28;
const DEFAULT_EXIT_EASE = "power2.in";
const DEFAULT_EXIT_BLUR = 0;
const DEFAULT_IDLE_DELAY_MS = 0;

export default function MouseTrail({
  images,
  imageWidth = 140,
  imageHeight = 200,
  stagger = 0.03,
  duration = 0.5,
  ease = "power3.out",
  spawnDistance = DEFAULT_SPAWN_DISTANCE,
  minSeparation = DEFAULT_MIN_SEPARATION,
  maxVisibleImages = DEFAULT_MAX_VISIBLE,
  imageLifetimeMs = DEFAULT_LIFETIME_MS,
  exitDuration = DEFAULT_EXIT_DURATION,
  pointerLeaveExitDuration = DEFAULT_POINTER_LEAVE_EXIT,
  exitEase = DEFAULT_EXIT_EASE,
  exitBlur = DEFAULT_EXIT_BLUR,
  idleDelayMs = DEFAULT_IDLE_DELAY_MS,
}: MouseTrailProps) {
  const reactId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
    );
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(media.matches && !motion.matches);
    sync();
    media.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const { cards, innerNodesRef } = useMouseTrailController({
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
  });

  if (!enabled || images.length === 0) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-hidden="true"
      data-mouse-trail={reactId}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          className={styles.card}
          style={
            {
              width: imageWidth,
              height: imageHeight,
              transform: `translate3d(${card.x - imageWidth / 2}px, ${card.y - imageHeight / 2}px, 0) rotate(${card.rotate}deg)`,
            } as CSSProperties
          }
        >
          <div
            className={styles.inner}
            ref={(node) => {
              if (node) innerNodesRef.current.set(card.id, node);
              else innerNodesRef.current.delete(card.id);
            }}
          >
            <Image
              src={card.src}
              alt=""
              width={imageWidth}
              height={imageHeight}
              className={styles.image}
              draggable={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
