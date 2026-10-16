"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useContactIntroMotion(rootRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const eyebrow = root.querySelector("[data-contact-intro-eyebrow]");
      const copy = root.querySelector("[data-contact-intro-copy]");
      const targets = [eyebrow, copy].filter(Boolean);

      const reveal = () => {
        gsap.set(targets, { clearProps: "all" });
      };

      if (prefersReducedMotion()) {
        reveal();
        return;
      }

      gsap.fromTo(
        targets,
        { y: 64, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
          onComplete: reveal,
          onInterrupt: reveal,
        },
      );
    },
    { scope: rootRef },
  );
}
