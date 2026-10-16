"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DESKTOP_MIN = 1024;
const MIN_PIN_HEIGHT = 560;
const INACTIVE = 0.28;
const FOCUS_RATIO = 0.48;
/** Brandium left-column inset for the logo tile (Y tracks active name only). */
const PREVIEW_LEFT_MIN = 48;
const PREVIEW_LEFT_MAX = 132;
const PREVIEW_LEFT_RATIO = 0.09;

type UseClientShowcaseMotionOptions = {
  rootRef: RefObject<HTMLElement | null>;
  namesRef: RefObject<HTMLUListElement | null>;
  itemCount: number;
  hoverIndex: number | null;
  onScrollIndexChange: (index: number) => void;
  onScrub: () => void;
  scrollToIndexRef: RefObject<((index: number) => void) | null>;
};

function canPin() {
  if (prefersReducedMotion()) return false;
  if (window.innerWidth < DESKTOP_MIN) return false;
  if (window.innerHeight < MIN_PIN_HEIGHT) return false;
  return true;
}

function paintNames(
  buttons: HTMLElement[],
  position: number,
  hoverIndex: number | null,
) {
  buttons.forEach((button, index) => {
    if (hoverIndex !== null) {
      const active = index === hoverIndex;
      gsap.set(button, {
        color: active ? "#f7f7f7" : "#4a4a4a",
        scale: active ? 1 : 0.78,
        opacity: active ? 1 : 0.55,
        transformOrigin: "50% 50%",
      });
      return;
    }

    const distance = Math.abs(index - position);
    const intensity = 1 - Math.min(Math.max((distance - 0.04) / 1.45, 0), 1);
    const mix = INACTIVE + intensity * (1 - INACTIVE);
    const channel = Math.round(70 + mix * (247 - 70));
    const scale = 0.72 + intensity * 0.28;
    const opacity = 0.32 + intensity * 0.68;
    gsap.set(button, {
      color: `rgb(${channel} ${channel} ${channel})`,
      scale,
      opacity,
      transformOrigin: "50% 50%",
    });
  });
}

function closestIndex(
  buttons: HTMLElement[],
  focusViewportY: number,
): number {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const distance = Math.abs(mid - focusViewportY);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function pinPagesFor(itemCount: number) {
  return Math.max(2.4, (itemCount - 1) * 0.55);
}

export function useClientShowcaseMotion({
  rootRef,
  namesRef,
  itemCount,
  hoverIndex,
  onScrollIndexChange,
  onScrub,
  scrollToIndexRef,
}: UseClientShowcaseMotionOptions) {
  const hoverRef = useRef(hoverIndex);
  const positionRef = useRef(0);
  const onIndexRef = useRef(onScrollIndexChange);
  const onScrubRef = useRef(onScrub);
  const buttonsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    hoverRef.current = hoverIndex;
    onIndexRef.current = onScrollIndexChange;
    onScrubRef.current = onScrub;
    paintNames(buttonsRef.current, positionRef.current, hoverIndex);
  }, [hoverIndex, onScrollIndexChange, onScrub]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const names = namesRef.current;
      if (!root || !names || itemCount === 0) return;

      const track = root.querySelector<HTMLElement>("[data-clients-pin-track]");
      const stage = root.querySelector<HTMLElement>("[data-clients-stage]");
      const preview = root.querySelector<HTMLElement>("[data-client-preview]");
      const buttons = [
        ...names.querySelectorAll<HTMLElement>("[data-client-name] button"),
      ];
      buttonsRef.current = buttons;
      if (!track || !stage || buttons.length === 0) return;

      let disposePin: (() => void) | undefined;
      let pinned = false;
      let trigger: ScrollTrigger | null = null;

      const clearTracked = () => {
        gsap.set(names, { clearProps: "transform" });
        gsap.set(buttons, { clearProps: "transform,color,opacity" });
        if (preview) {
          gsap.set(preview, { clearProps: "top,left,x,yPercent" });
        }
      };

      const applyStack = () => {
        disposePin?.();
        disposePin = undefined;
        pinned = false;
        trigger = null;
        root.dataset.clientsMode = "stack";
        track.style.removeProperty("--clientsPinPages");
        clearTracked();
        paintNames(buttons, 0, hoverRef.current);
        onIndexRef.current(0);
        scrollToIndexRef.current = (index) => {
          onIndexRef.current(
            Math.min(Math.max(Math.round(index), 0), itemCount - 1),
          );
        };
      };

      const applyPin = () => {
        disposePin?.();
        pinned = true;
        root.dataset.clientsMode = "pin";
        track.style.setProperty(
          "--clientsPinPages",
          String(pinPagesFor(itemCount)),
        );

        let focusY = stage.clientHeight * FOCUS_RATIO;
        let centers = buttons.map(
          (button) => button.offsetTop + button.offsetHeight / 2,
        );
        let lastIndex = -1;

        const refreshMetrics = () => {
          focusY = stage.clientHeight * FOCUS_RATIO;
          centers = buttons.map(
            (button) => button.offsetTop + button.offsetHeight / 2,
          );
        };

        const lerpCenter = (position: number) => {
          const low = Math.floor(position);
          const high = Math.ceil(position);
          const a = centers[low] ?? 0;
          const b = centers[high] ?? a;
          return a + (b - a) * (position - low);
        };

        const placePreview = (index: number) => {
          if (!preview) return;
          const activeButton = buttons[index];
          if (!activeButton) return;
          const stageRect = stage.getBoundingClientRect();
          const buttonRect = activeButton.getBoundingClientRect();
          const left = Math.min(
            PREVIEW_LEFT_MAX,
            Math.max(PREVIEW_LEFT_MIN, stage.clientWidth * PREVIEW_LEFT_RATIO),
          );
          const top =
            buttonRect.top - stageRect.top + buttonRect.height / 2;
          gsap.set(preview, {
            top,
            left,
            x: 0,
            yPercent: -50,
          });
        };

        const setProgress = (progress: number) => {
          if (hoverRef.current !== null) {
            hoverRef.current = null;
            onScrubRef.current();
          }

          const position = Math.min(
            Math.max(progress * (itemCount - 1), 0),
            itemCount - 1,
          );
          positionRef.current = position;
          gsap.set(names, { y: focusY - lerpCenter(position) });

          const stageTop = stage.getBoundingClientRect().top;
          const focusViewportY = stageTop + focusY;
          const visualIndex = closestIndex(buttons, focusViewportY);

          paintNames(buttons, position, null);
          placePreview(visualIndex);

          if (visualIndex !== lastIndex) {
            lastIndex = visualIndex;
            onIndexRef.current(visualIndex);
          }
        };

        refreshMetrics();

        // CSS sticky holds the stage; ScrollTrigger only drives scrub progress.
        trigger = ScrollTrigger.create({
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onRefresh: refreshMetrics,
          onUpdate: (self) => setProgress(self.progress),
        });

        const boot = () => {
          refreshMetrics();
          if (trigger) {
            setProgress(trigger.progress);
          }
        };

        boot();
        if (document.fonts?.ready) {
          void document.fonts.ready.then(() => {
            boot();
            ScrollTrigger.refresh();
          });
        }

        scrollToIndexRef.current = (index) => {
          const clamped = Math.min(Math.max(index, 0), itemCount - 1);
          const st = trigger;
          if (!st) {
            onIndexRef.current(clamped);
            return;
          }
          const progress = itemCount <= 1 ? 0 : clamped / (itemCount - 1);
          const target = st.start + (st.end - st.start) * progress;
          window.scrollTo({ top: target, behavior: "auto" });
          setProgress(progress);
        };

        disposePin = () => {
          trigger?.kill();
          trigger = null;
          clearTracked();
          track.style.removeProperty("--clientsPinPages");
          scrollToIndexRef.current = null;
        };
      };

      const stageReady = () => {
        const rect = stage.getBoundingClientRect();
        return (
          stage.clientHeight >= 200 &&
          rect.width >= 200 &&
          rect.height >= 200
        );
      };

      const applyMode = () => {
        if (!canPin() || itemCount < 3 || !stageReady()) {
          applyStack();
          return;
        }
        applyPin();
      };

      const onResize = () => {
        const shouldPin = canPin() && itemCount >= 3 && stageReady();
        if (shouldPin !== pinned) {
          applyMode();
        } else if (pinned) {
          track.style.setProperty(
            "--clientsPinPages",
            String(pinPagesFor(itemCount)),
          );
          ScrollTrigger.refresh();
        }
      };

      applyMode();

      window.addEventListener("resize", onResize);
      const stageObserver = new ResizeObserver(() => onResize());
      stageObserver.observe(stage);
      stageObserver.observe(track);
      if (root.isConnected) stageObserver.observe(root);

      let retries = 0;
      let retryTimer: number | undefined;
      const retryPin = () => {
        onResize();
        retries += 1;
        if (!pinned && retries < 40) {
          retryTimer = window.setTimeout(retryPin, 200);
        }
      };
      retryTimer = window.setTimeout(retryPin, 0);

      void document.fonts?.ready?.then(() => {
        onResize();
        ScrollTrigger.refresh();
      });

      requestAnimationFrame(() => {
        applyMode();
        ScrollTrigger.refresh();
      });

      return () => {
        window.removeEventListener("resize", onResize);
        stageObserver.disconnect();
        if (retryTimer !== undefined) window.clearTimeout(retryTimer);
        disposePin?.();
        scrollToIndexRef.current = null;
        root.dataset.clientsMode = "stack";
        track.style.removeProperty("--clientsPinPages");
      };
    },
    { scope: rootRef, dependencies: [itemCount] },
  );
}
