"use client";

import { GlowingArchSection } from "@/features/services/components/GlowingArchSection/GlowingArchSection";
import { useRevealOnce } from "@/features/services/hooks/useRevealOnce";

type ServicesHeroProps = {
  eyebrow: string;
  heading: string;
};

export function ServicesHero({ eyebrow, heading }: ServicesHeroProps) {
  const { setNode, revealed } = useRevealOnce({
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.01,
  });

  return (
    <div ref={setNode}>
      <GlowingArchSection
        eyebrow={eyebrow}
        heading={heading}
        headingLevel="h1"
        variant="hero"
        revealed={revealed}
      />
    </div>
  );
}
