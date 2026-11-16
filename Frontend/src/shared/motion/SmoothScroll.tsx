"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling for the public site, driven by GSAP's ticker so every
 * ScrollTrigger animation stays in sync. Disabled for reduced-motion visitors;
 * touch devices keep native scrolling (Lenis default). Elements that must scroll
 * on their own (modals, menus) opt out with the `data-lenis-prevent` attribute.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const lenis = new Lenis({
      duration: 1.1,
      anchors: { offset: -96 },
      autoRaf: false,
      // Let menus, dialogs and any inner scroll area keep native wheel scrolling.
      prevent: (node: HTMLElement) => {
        if (node.closest("[data-lenis-prevent], [role='dialog'], [aria-modal='true']")) return true;
        const style = window.getComputedStyle(node);
        return /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
      },
    });
    const onTick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
  return null;
}
