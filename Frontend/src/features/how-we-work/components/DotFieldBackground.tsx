"use client";

import { useEffect, useRef } from "react";
import {
  paintDotField,
  readThemeDotColors,
  sizeDotFieldCanvas,
  type RgbColor,
} from "@/features/how-we-work/lib/paintDotField";
import styles from "@/features/how-we-work/styles/dotField.module.css";

/** ~180ms feel at 60fps for pointer pocket easing. */
const SMOOTHING = 0.18;
const IDLE_STOP_THRESHOLD = 0.004;

type Point = { x: number; y: number };

export function DotFieldBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const canvas = canvasRef.current;
    const section = layer?.parentElement;
    if (!layer || !canvas || !section) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const interactive = finePointer && !reduceMotion;

    let baseColor: RgbColor = { r: 12, g: 43, b: 71 };
    let activeColor: RgbColor = { r: 77, g: 232, b: 244 };
    let width = 0;
    let height = 0;
    let targetPointer: Point = { x: 0, y: 0 };
    let renderPointer: Point = { x: 0, y: 0 };
    let targetInfluence = 0;
    let influence = 0;
    let isVisible = true;
    let frameId = 0;
    let running = false;

    const syncColors = () => {
      const colors = readThemeDotColors(section);
      baseColor = colors.baseColor;
      activeColor = colors.activeColor;
    };

    const draw = () => {
      paintDotField(context, {
        width,
        height,
        pointerX: renderPointer.x,
        pointerY: renderPointer.y,
        influence,
        interactive,
        baseColor,
        activeColor,
      });
    };

    const stopLoop = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
      running = false;
    };

    const tick = () => {
      renderPointer = {
        x: renderPointer.x + (targetPointer.x - renderPointer.x) * SMOOTHING,
        y: renderPointer.y + (targetPointer.y - renderPointer.y) * SMOOTHING,
      };
      influence += (targetInfluence - influence) * SMOOTHING;

      if (Math.abs(targetInfluence - influence) < IDLE_STOP_THRESHOLD) {
        influence = targetInfluence;
      }
      if (
        Math.abs(targetPointer.x - renderPointer.x) < 0.05 &&
        Math.abs(targetPointer.y - renderPointer.y) < 0.05
      ) {
        renderPointer = targetPointer;
      }

      draw();

      const stillEasing =
        influence > IDLE_STOP_THRESHOLD ||
        targetInfluence > 0 ||
        Math.abs(targetPointer.x - renderPointer.x) > 0.05 ||
        Math.abs(targetPointer.y - renderPointer.y) > 0.05;

      if (stillEasing && isVisible) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      stopLoop();
    };

    const startLoop = () => {
      if (running || !interactive || !isVisible) {
        return;
      }
      running = true;
      frameId = requestAnimationFrame(tick);
    };

    const resize = () => {
      const bounds = section.getBoundingClientRect();
      const sized = sizeDotFieldCanvas(canvas, bounds.width, bounds.height);
      width = sized.width;
      height = sized.height;
      syncColors();
      draw();
    };

    const localPoint = (event: PointerEvent): Point => {
      const bounds = section.getBoundingClientRect();
      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!interactive || !isVisible) {
        return;
      }
      targetPointer = localPoint(event);
      targetInfluence = 1;
      startLoop();
    };

    const onPointerLeave = () => {
      if (!interactive) {
        return;
      }
      targetInfluence = 0;
      startLoop();
    };

    syncColors();
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(section);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (!isVisible) {
          targetInfluence = 0;
          influence = 0;
          stopLoop();
          draw();
          return;
        }
        draw();
      },
      { root: null, threshold: 0 },
    );
    visibilityObserver.observe(section);

    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={layerRef} className={styles.layer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
