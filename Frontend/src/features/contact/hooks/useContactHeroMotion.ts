"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(useGSAP);

export function useContactHeroMotion(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const wordmark = root.querySelector("[data-contact-hero-wordmark]");
      const logoFrame = root.querySelector("[data-contact-hero-logo-frame]");
      const logoMotion = root.querySelector("[data-contact-hero-logo-motion]");
      const copy = root.querySelector("[data-contact-hero-copy]");
      const lineInners = root.querySelectorAll("[data-contact-hero-line-inner]");
      const cue = root.querySelector("[data-contact-scroll-cue]");

      const reveal = () => {
        gsap.set([wordmark, logoFrame, copy, lineInners, cue], {
          clearProps: "all",
        });
      };

      if (prefersReducedMotion()) {
        reveal();
        return;
      }

      const tl = gsap.timeline({ delay: 0.35, onComplete: reveal });

      tl.fromTo(
        wordmark,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
        0,
      );

      tl.fromTo(
        logoFrame,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
        0.1,
      );

      tl.fromTo(
        lineInners,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.2,
      );

      tl.fromTo(
        cue,
        { opacity: 0 },
        { opacity: 0.45, duration: 0.6, ease: "power2.out" },
        0.35,
      );

      if (logoMotion) {
        gsap.to(logoMotion, {
          y: -10,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });
      }

      if (cue) {
        gsap.to(cue, {
          opacity: 1,
          duration: 1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.1,
        });
      }
    },
    { scope: rootRef },
  );
}
