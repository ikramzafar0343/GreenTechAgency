"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

type SplitRevealProps = {
  readonly as?: "h1" | "h2" | "h3";
  readonly children: string;
  readonly className?: string | undefined;
  readonly id?: string | undefined;
};

/**
 * Heading that reveals word by word (GSAP SplitText + ScrollTrigger) the first time it
 * scrolls into view. Server HTML contains the plain text, so SEO and screen readers
 * are unaffected; the split is reverted after the animation.
 */
export function SplitReveal({ as: Tag = "h2", children, className, id }: SplitRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const split = SplitText.create(el, { type: "words", mask: "words", aria: "auto" });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.045,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onComplete: () => split.revert(),
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
