"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ClosingCtaMotionProps = {
  enabled: boolean;
  drawArrow: boolean;
};

export function ClosingCtaMotion({
  enabled,
  drawArrow,
}: ClosingCtaMotionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!enabled) {
        return;
      }

      const root = scopeRef.current?.parentElement;
      if (!root) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) {
        return;
      }

      const panel = root.querySelector<HTMLElement>("[data-closing-cta-panel]");
      const paths = root.querySelectorAll<SVGPathElement>(
        "[data-closing-cta-panel] path",
      );

      if (panel) {
        gsap.fromTo(
          panel,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      if (drawArrow && paths.length > 0) {
        gsap.fromTo(
          paths,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.5,
            ease: "power1.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    },
    { scope: scopeRef, dependencies: [enabled, drawArrow] },
  );

  return <div ref={scopeRef} hidden aria-hidden="true" />;
}
