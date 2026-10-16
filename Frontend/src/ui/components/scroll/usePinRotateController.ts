"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_MAX = 767;

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type PinRotateControllerOptions = {
  root: HTMLElement;
  dwellVh: number;
  rotationStrength: number;
  minPinHeight: number;
  forceStack: boolean;
};

function isPinEligible(
  root: HTMLElement,
  minPinHeight: number,
  forceStack: boolean,
) {
  if (forceStack || prefersReducedMotion()) return false;
  if (window.innerWidth <= MOBILE_MAX) return false;
  if (window.innerHeight < minPinHeight) return false;

  const panels = root.querySelectorAll<HTMLElement>("[data-pin-rotate='section']");
  if (panels.length === 0) return false;

  const usable = window.innerHeight;
  for (const panel of panels) {
    if (panel.scrollHeight > usable + 8) return false;
  }
  return true;
}

function setStackMode(root: HTMLElement, stage: HTMLElement, panels: HTMLElement[]) {
  root.dataset.pinMode = "stack";
  gsap.set(stage, { clearProps: "height" });
  gsap.set(panels, {
    clearProps: "position,inset,transform,opacity,zIndex,pointerEvents",
  });
}

function bindPinMotion(
  root: HTMLElement,
  stage: HTMLElement,
  panels: HTMLElement[],
  intro: HTMLElement | null,
  dwellVh: number,
  rotationStrength: number,
) {
  const createdTriggers: ScrollTrigger[] = [];
  const enterRotation = Math.min(rotationStrength, 2.5);

  root.dataset.pinMode = "pin";
  const panelHeight = Math.max(
    ...panels.map((panel) => panel.offsetHeight),
    window.innerHeight,
  );
  stage.style.height = `${panelHeight}px`;

  panels.forEach((panel, index) => {
    gsap.set(panel, {
      position: "absolute",
      inset: 0,
      zIndex: panels.length - index,
      rotation: index === 0 ? enterRotation : rotationStrength,
      y: index === 0 ? "8vh" : "12vh",
      scale: index === 0 ? 1 : 0.985,
      opacity: 1,
      transformOrigin: "center center",
      pointerEvents: index === 0 ? "auto" : "none",
    });
  });

  if (intro && !prefersReducedMotion()) {
    const introTween = gsap.fromTo(
      intro,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
        scrollTrigger: { trigger: intro, start: "top 85%", once: true },
      },
    );
    if (introTween.scrollTrigger) createdTriggers.push(introTween.scrollTrigger);
  }

  const segment = 1 / panels.length;
  const handoff = Math.min(0.22, segment * 0.28);
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: () => `+=${panels.length * window.innerHeight * dwellVh}`,
      pin: true,
      scrub: 0.65,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  if (tl.scrollTrigger) createdTriggers.push(tl.scrollTrigger);

  const firstPanel = panels[0];
  if (firstPanel) {
    tl.to(
      firstPanel,
      {
        rotation: 0,
        y: 0,
        scale: 1,
        duration: handoff,
        ease: "power2.inOut",
      },
      0,
    );
  }

  panels.forEach((panel, index) => {
    const start = index * segment;
    const end = (index + 1) * segment;

    if (index > 0) {
      tl.to(
        panel,
        {
          rotation: 0,
          y: 0,
          scale: 1,
          zIndex: panels.length + index,
          pointerEvents: "auto",
          duration: handoff,
          ease: "power2.inOut",
        },
        start,
      );
    }

    if (index < panels.length - 1) {
      tl.to(
        panel,
        {
          rotation: -rotationStrength,
          y: "-8vh",
          scale: 0.985,
          pointerEvents: "none",
          duration: handoff,
          ease: "power2.inOut",
        },
        end - handoff,
      );
    }
  });

  return () => {
    createdTriggers.forEach((st) => st.kill());
    tl.kill();
  };
}

export function setupPinRotate({
  root,
  dwellVh,
  rotationStrength,
  minPinHeight,
  forceStack,
}: PinRotateControllerOptions) {
  const stage = root.querySelector<HTMLElement>("[data-pin-rotate='stage']");
  const panels = [
    ...root.querySelectorAll<HTMLElement>("[data-pin-rotate='section']"),
  ];
  const intro = root.querySelector<HTMLElement>("[data-pin-rotate='intro']");

  if (!stage || panels.length === 0) return () => undefined;

  let disposeMotion: (() => void) | undefined;
  let pinned = false;

  const applyMode = () => {
    disposeMotion?.();
    disposeMotion = undefined;

    const enablePin = isPinEligible(root, minPinHeight, forceStack);
    if (!enablePin) {
      pinned = false;
      setStackMode(root, stage, panels);
      if (intro && !prefersReducedMotion() && !intro.dataset.revealed) {
        intro.dataset.revealed = "true";
        gsap.fromTo(
          intro,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power3.out",
            scrollTrigger: { trigger: intro, start: "top 85%", once: true },
          },
        );
      }
      return;
    }

    pinned = true;
    disposeMotion = bindPinMotion(
      root,
      stage,
      panels,
      intro,
      dwellVh,
      rotationStrength,
    );
  };

  applyMode();

  const onResize = () => {
    const shouldPin = isPinEligible(root, minPinHeight, forceStack);
    if (shouldPin !== pinned) {
      applyMode();
    } else if (pinned) {
      ScrollTrigger.refresh();
    }
  };

  window.addEventListener("resize", onResize);
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    window.removeEventListener("resize", onResize);
    disposeMotion?.();
    setStackMode(root, stage, panels);
  };
}
