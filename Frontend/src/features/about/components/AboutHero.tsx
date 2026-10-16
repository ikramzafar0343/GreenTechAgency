"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutHeroContent } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutHero.module.css";

gsap.registerPlugin(useGSAP);

type AboutHeroProps = {
  content: AboutHeroContent;
};

export function AboutHero({ content }: AboutHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) {
        return;
      }

      const lines = root.querySelectorAll<HTMLElement>("[data-hero-line]");
      const support = root.querySelector<HTMLElement>("[data-hero-support]");
      const orbit = root.querySelector<HTMLElement>("[data-hero-orbit]");
      const foot = root.querySelector<HTMLElement>("[data-hero-foot]");

      root.dataset.motion = "ready";
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      if (support) gsap.set(support, { y: 14, opacity: 0 });
      if (orbit) gsap.set(orbit, { opacity: 0, scale: 0.7 });
      if (foot) gsap.set(foot, { y: 10, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (orbit) {
        tl.to(orbit, { opacity: 1, scale: 1, duration: 0.55 });
      }
      tl.to(
        lines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.105,
        },
        orbit ? "-=0.15" : 0,
      );
      if (support) {
        tl.to(support, { y: 0, opacity: 1, duration: 0.55 }, "-=0.35");
      }
      if (foot) {
        tl.to(foot, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2");
      }
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      aria-labelledby="about-hero-heading"
    >
      <div className={styles.inner}>
        <div className={styles.orbit} data-hero-orbit aria-hidden="true" />
        <h1 id="about-hero-heading" className={styles.headline}>
          {content.headlineLines.map((line) => (
            <span key={line} className={styles.lineMask}>
              <span className={styles.line} data-hero-line>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className={styles.support} data-hero-support>
          {content.supportingLines.map((line) => (
            <span key={line} className={styles.supportLine}>
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className={styles.foot} data-hero-foot>
        <span className={styles.footLeft}>{content.footLeft}</span>
        <a href="#about-group-portrait" className={styles.footCenter}>
          <span className={styles.footArrow} aria-hidden="true">
            ↓
          </span>
          <span>{content.footCenter}</span>
        </a>
        <span className={styles.footRight}>{content.footRight}</span>
      </div>
    </section>
  );
}
