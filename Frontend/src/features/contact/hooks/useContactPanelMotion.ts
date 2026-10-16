"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";

gsap.registerPlugin(useGSAP);

type Options = {
  panelRef: RefObject<HTMLElement | null>;
  screenRef: RefObject<HTMLElement | null>;
  screenKey: string;
};

export function useContactPanelMotion({
  panelRef,
  screenRef,
  screenKey,
}: Options) {
  useGSAP(
    () => {
      const screen = screenRef.current;
      if (!screen) return;

      const prompt = screen.querySelector("[data-contact-prompt]");
      const controls = screen.querySelector("[data-contact-controls]");

      const reveal = () => {
        gsap.set([prompt, controls], { clearProps: "all" });
      };

      if (prefersReducedMotion()) {
        reveal();
        return;
      }

      const ease = "power3.out";
      const screenName = screen.getAttribute("data-contact-screen") ?? "";
      const isFormScreen =
        screenName === "projectDetails" ||
        screenName === "careersDetails" ||
        screenName === "general";

      if (prompt) {
        const promptTween: gsap.TweenVars = {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease,
        };
        if (isFormScreen) {
          promptTween.onComplete = reveal;
        }
        gsap.fromTo(
          prompt,
          { y: isFormScreen ? 28 : 64, opacity: 0 },
          promptTween,
        );
        if (!isFormScreen) {
          gsap.to(prompt, {
            scale: 0.95,
            duration: 0.55,
            delay: 0.35,
            ease: "power2.out",
            onComplete: reveal,
          });
        }
      }

      if (controls) {
        gsap.fromTo(
          controls,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            delay: 0.18,
            ease,
            onComplete: reveal,
          },
        );
      }
    },
    { scope: panelRef, dependencies: [screenKey] },
  );
}
