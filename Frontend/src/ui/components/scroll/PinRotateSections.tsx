"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Children,
  isValidElement,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "@/ui/components/scroll/PinRotateSections.module.css";
import type {
  PinRotateSectionsProps,
  PinRotateSlotProps,
} from "@/ui/components/scroll/pinRotateTypes";
import { setupPinRotate } from "@/ui/components/scroll/usePinRotateController";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function PinRotateIntro({ children, className }: PinRotateSlotProps) {
  return (
    <div
      className={[styles.intro, className].filter(Boolean).join(" ")}
      data-pin-rotate="intro"
    >
      {children}
    </div>
  );
}
PinRotateIntro.displayName = "PinRotateIntro";

function PinRotateSection({ children, className }: PinRotateSlotProps) {
  return (
    <div
      className={[styles.section, className].filter(Boolean).join(" ")}
      data-pin-rotate="section"
    >
      {children}
    </div>
  );
}
PinRotateSection.displayName = "PinRotateSection";

function PinRotateOutro({ children, className }: PinRotateSlotProps) {
  return (
    <div
      className={[styles.outro, className].filter(Boolean).join(" ")}
      data-pin-rotate="outro"
    >
      {children}
    </div>
  );
}
PinRotateOutro.displayName = "PinRotateOutro";

function isSlot(
  child: ReactNode,
  type: typeof PinRotateIntro | typeof PinRotateSection | typeof PinRotateOutro,
): child is ReactElement<PinRotateSlotProps> {
  return isValidElement(child) && child.type === type;
}

export default function PinRotateSections({
  children,
  className,
  dwellVh = 0.9,
  rotationStrength = 3.5,
  minPinHeight = 700,
  forceStack = false,
}: PinRotateSectionsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const childList = Children.toArray(children);
  const intro = childList.find((child) => isSlot(child, PinRotateIntro));
  const sections = childList.filter((child) =>
    isSlot(child, PinRotateSection),
  );
  const outro = childList.find((child) => isSlot(child, PinRotateOutro));

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      return setupPinRotate({
        root,
        dwellVh,
        rotationStrength,
        minPinHeight,
        forceStack,
      });
    },
    {
      scope: rootRef,
      dependencies: [
        dwellVh,
        rotationStrength,
        minPinHeight,
        forceStack,
        sections.length,
      ],
    },
  );

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-pin-mode="stack"
    >
      {intro}
      <div className={styles.stage} data-pin-rotate="stage">
        {sections}
      </div>
      {outro}
    </div>
  );
}

export { PinRotateIntro, PinRotateSection, PinRotateOutro };
