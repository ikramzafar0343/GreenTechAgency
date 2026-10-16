"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useContactFooterMotion(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const floatInner = root.querySelector("[data-contact-footer-float-inner]");
      const tray = root.querySelector("[data-contact-footer-tray]");
      const panel = root.querySelector("[data-contact-footer-panel]");
      const separators = root.querySelectorAll("[data-contact-footer-sep]");

      if (prefersReducedMotion()) {
        gsap.set([floatInner, separators], { clearProps: "all" });
        if (tray) gsap.set(tray, { clearProps: "all", y: 0, yPercent: 0 });
        return;
      }

      if (floatInner) {
        gsap.to(floatInner, {
          y: -16,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause play pause",
          },
        });
      }

      if (tray && panel) {
        gsap.fromTo(
          tray,
          { yPercent: -100 },
          {
            yPercent: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "bottom 92%",
              once: true,
            },
          },
        );
      }

      if (separators.length > 0) {
        gsap.to(separators, {
          rotation: 360,
          duration: 14,
          ease: "none",
          repeat: -1,
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause play pause",
          },
        });
      }
    },
    { scope: rootRef },
  );
}
