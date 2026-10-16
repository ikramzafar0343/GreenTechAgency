"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DESKTOP_MIN = 1025;

type UseServiceStickyStackOptions = {
  groupRef: RefObject<HTMLElement | null>;
  panelCount: number;
};

function foregroundContentHeight(foreground: HTMLElement) {
  const styles = getComputedStyle(foreground);
  const padY =
    (Number.parseFloat(styles.paddingTop) || 0) +
    (Number.parseFloat(styles.paddingBottom) || 0);

  let contentBottom = 0;
  for (const child of foreground.children) {
    if (!(child instanceof HTMLElement)) continue;
    contentBottom = Math.max(
      contentBottom,
      child.offsetTop + child.offsetHeight,
    );
  }

  // Prefer child bounds so a 100dvh sticky shell does not report itself as overflow.
  return Math.max(contentBottom, padY);
}

function canStack(group: HTMLElement) {
  if (prefersReducedMotion()) return false;
  if (window.innerWidth < DESKTOP_MIN) return false;

  const shells = [
    ...group.querySelectorAll<HTMLElement>("[data-service-shell]"),
  ];
  if (shells.length < 2) return false;

  const viewport = window.innerHeight;
  return shells.every((shell) => {
    const foreground = shell.querySelector<HTMLElement>(
      "[data-service-foreground]",
    );
    if (!foreground) return false;
    return foregroundContentHeight(foreground) <= viewport - 8;
  });
}

function resetVisualState(group: HTMLElement) {
  group.querySelectorAll<HTMLElement>("[data-service-digit-track]").forEach((track) => {
    gsap.set(track, { clearProps: "transform" });
  });
  group.querySelectorAll<HTMLElement>("[data-service-word-inner]").forEach((inner) => {
    gsap.set(inner, { clearProps: "transform" });
  });
  group.querySelectorAll<HTMLElement>("[data-service-foreground]").forEach((fg) => {
    gsap.set(fg, { clearProps: "opacity" });
  });
}

export function useServiceStickyStack({
  groupRef,
  panelCount,
}: UseServiceStickyStackOptions) {
  useGSAP(
    () => {
      const group = groupRef.current;
      if (!group || panelCount === 0) return;

      const shells = [
        ...group.querySelectorAll<HTMLElement>("[data-service-shell]"),
      ];
      if (shells.length === 0) return;

      let ctx: gsap.Context | null = null;

      const teardown = () => {
        ctx?.revert();
        ctx = null;
        resetVisualState(group);
      };

      const applyFlow = () => {
        teardown();
        group.dataset.servicesMode = "flow";
      };

      const applyStack = () => {
        teardown();
        group.dataset.servicesMode = "stack";

        ctx = gsap.context(() => {
          shells.forEach((shell, index) => {
            const foreground = shell.querySelector<HTMLElement>(
              "[data-service-foreground]",
            );
            if (!foreground) return;

            const isFinal = index === shells.length - 1;
            gsap.set(foreground, { opacity: 1 });

            if (!isFinal) {
              gsap.fromTo(
                foreground,
                { opacity: 1 },
                {
                  opacity: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: shell,
                    start: "top top",
                    end: "bottom 20%",
                    scrub: true,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }

            const tracks = [
              ...shell.querySelectorAll<HTMLElement>(
                "[data-service-digit-track]",
              ),
            ];
            const firstTrack = tracks[0];
            if (firstTrack) {
              gsap.set(tracks, { yPercent: -100 });
              const numeral =
                shell.querySelector<HTMLElement>("[data-service-numeral]") ??
                firstTrack;
              const digitTl = gsap.timeline({
                paused: true,
                defaults: { duration: 0.75, ease: "expo.inOut" },
              });
              tracks.forEach((track, trackIndex) => {
                digitTl.to(track, { yPercent: 0 }, trackIndex * 0.04);
              });

              ScrollTrigger.create({
                trigger: numeral,
                start: "top 85%",
                onEnter: () => digitTl.restart(),
                onLeaveBack: () => {
                  digitTl.pause(0);
                  gsap.set(tracks, { yPercent: -100 });
                },
                invalidateOnRefresh: true,
              });
            }

            const words = [
              ...shell.querySelectorAll<HTMLElement>(
                "[data-service-word-inner]",
              ),
            ];
            words.forEach((inner) => {
              const windowEl = inner.parentElement;
              if (!windowEl) return;
              gsap.set(inner, { yPercent: 100 });
              gsap.to(inner, {
                yPercent: 0,
                duration: 0.5,
                ease: "power3.inOut",
                scrollTrigger: {
                  trigger: windowEl,
                  start: "top 80%",
                  end: () => `+=${Math.max(windowEl.offsetHeight, 1)}`,
                  scrub: 2,
                  once: true,
                  invalidateOnRefresh: true,
                },
              });
            });
          });
        }, group);
      };

      const syncMode = () => {
        const shouldStack = canStack(group);
        if (shouldStack) {
          if (group.dataset.servicesMode !== "stack") {
            applyStack();
          }
          ScrollTrigger.refresh();
          return;
        }
        if (group.dataset.servicesMode !== "flow") {
          applyFlow();
          ScrollTrigger.refresh();
        }
      };

      group.dataset.servicesMode = "flow";
      group.dataset.servicesKeyboard = "false";
      resetVisualState(group);

      const onFocusIn = () => {
        group.dataset.servicesKeyboard = "true";
      };
      const onFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget;
        if (next instanceof Node && group.contains(next)) return;
        group.dataset.servicesKeyboard = "false";
      };

      group.addEventListener("focusin", onFocusIn);
      group.addEventListener("focusout", onFocusOut);
      window.addEventListener("resize", syncMode);

      const start = async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready.catch(() => undefined);
        }
        syncMode();
      };

      void start();

      return () => {
        window.removeEventListener("resize", syncMode);
        group.removeEventListener("focusin", onFocusIn);
        group.removeEventListener("focusout", onFocusOut);
        applyFlow();
        group.dataset.servicesKeyboard = "false";
      };
    },
    { scope: groupRef, dependencies: [panelCount] },
  );
}
