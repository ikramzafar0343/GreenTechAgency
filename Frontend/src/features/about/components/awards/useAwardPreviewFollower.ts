"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(useGSAP);

type UseAwardPreviewFollowerOptions = {
  rootRef: RefObject<HTMLElement | null>;
  listRef: RefObject<HTMLElement | null>;
  previewRef: RefObject<HTMLElement | null>;
  ready?: boolean;
};

function canFollow() {
  if (typeof window === "undefined") return false;
  if (prefersReducedMotion()) return false;
  if (window.innerWidth <= 1024) return false;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return false;
  }
  return true;
}

function rowFromTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-award-row]");
}

export function useAwardPreviewFollower({
  rootRef,
  listRef,
  previewRef,
  ready = true,
}: UseAwardPreviewFollowerOptions) {
  useGSAP(
    () => {
      if (!ready) return;

      const root = rootRef.current;
      const list = listRef.current;
      const preview = previewRef.current;
      if (!root || !list || !preview) return;

      const img = preview.querySelector<HTMLImageElement>("img");
      if (!img) return;

      let quickY: ((value: number) => void) | null = null;
      let enabled = canFollow();
      let visible = false;
      let activeSrc: string | null = null;
      let hideTween: gsap.core.Tween | null = null;

      const clampedY = (clientY: number) => {
        const height = preview.offsetHeight || window.innerWidth * 0.14;
        const margin = 12;
        return Math.min(
          Math.max(clientY - height / 2, margin),
          window.innerHeight - height - margin,
        );
      };

      const hide = () => {
        if (!visible && Number(gsap.getProperty(preview, "opacity")) === 0) {
          return;
        }
        visible = false;
        activeSrc = null;
        hideTween?.kill();
        hideTween = gsap.to(preview, {
          opacity: 0,
          duration: 0.2,
          ease: "sine.out",
        });
      };

      const showAt = (clientY: number, src: string | null) => {
        if (!enabled || !src) {
          hide();
          return;
        }

        hideTween?.kill();
        hideTween = null;

        const nextY = clampedY(clientY);

        if (!visible) {
          gsap.set(preview, { y: nextY, opacity: 1 });
          visible = true;
        } else {
          quickY?.(nextY);
        }

        if (activeSrc !== src) {
          activeSrc = src;
          img.onerror = () => {
            if (activeSrc === src) hide();
          };
          if (img.getAttribute("src") !== src) {
            img.src = src;
          }
        }
      };

      quickY = gsap.quickTo(preview, "y", {
        duration: 0.7,
        ease: "power4.out",
      });

      gsap.set(preview, { opacity: 0, y: 0, x: 0 });

      const onListPointerOver = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || !enabled) return;
        const row = rowFromTarget(event.target);
        if (!row) return;
        showAt(event.clientY, row.dataset.previewSrc || null);
      };

      const onListPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || !enabled || !visible) return;
        const row = rowFromTarget(event.target);
        if (!row) return;
        // Keep media in sync while moving across rows without leave/enter gaps.
        const src = row.dataset.previewSrc || null;
        if (src && src !== activeSrc) {
          showAt(event.clientY, src);
          return;
        }
        quickY?.(clampedY(event.clientY));
      };

      const onListPointerOut = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const next = event.relatedTarget;
        if (next instanceof Node && list.contains(next)) return;
        hide();
      };

      const onFocusIn = (event: FocusEvent) => {
        if (!enabled) return;
        const row = rowFromTarget(event.target);
        if (!row) return;
        const rect = row.getBoundingClientRect();
        showAt(rect.top + rect.height / 2, row.dataset.previewSrc || null);
      };

      const onFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget;
        if (next instanceof Node && list.contains(next)) return;
        hide();
      };

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") hide();
      };

      const onVisibility = () => {
        if (document.hidden) hide();
      };

      const onResize = () => {
        enabled = canFollow();
        if (!enabled) hide();
      };

      list.addEventListener("pointerover", onListPointerOver);
      list.addEventListener("pointermove", onListPointerMove);
      list.addEventListener("pointerout", onListPointerOut);
      list.addEventListener("focusin", onFocusIn);
      list.addEventListener("focusout", onFocusOut);
      document.addEventListener("keydown", onKey);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);

      return () => {
        list.removeEventListener("pointerover", onListPointerOver);
        list.removeEventListener("pointermove", onListPointerMove);
        list.removeEventListener("pointerout", onListPointerOut);
        list.removeEventListener("focusin", onFocusIn);
        list.removeEventListener("focusout", onFocusOut);
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", onResize);
        img.onerror = null;
        hideTween?.kill();
        gsap.set(preview, { opacity: 0 });
      };
    },
    { scope: rootRef, dependencies: [ready] },
  );
}
