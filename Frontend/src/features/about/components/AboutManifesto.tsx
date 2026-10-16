"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import { ABOUT_TRAIL_IMAGES } from "@/features/about/model/aboutTrailImages";
import type { AboutManifestoContent } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutManifesto.module.css";
import MouseTrail from "@/ui/components/interactive/MouseTrail";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutManifestoProps = {
  content: AboutManifestoContent;
};

function splitWords(text: string) {
  return text.split(/(\s+)/).filter((part) => part.length > 0);
}

export function AboutManifesto({ content }: AboutManifestoProps) {
  const rootRef = useRef<HTMLElement>(null);
  const words = useMemo(() => splitWords(content.headline), [content.headline]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const wordNodes = root.querySelectorAll<HTMLElement>("[data-manifesto-word]");
      const side = root.querySelector<HTMLElement>("[data-manifesto-side]");

      if (prefersReducedMotion()) {
        wordNodes.forEach((node) => {
          node.dataset.active = "true";
        });
        return;
      }

      const total = wordNodes.length;
      ScrollTrigger.create({
        trigger: root,
        start: "top 68%",
        end: "bottom 60%",
        scrub: 0.7,
        onUpdate: (self) => {
          const activeCount = Math.floor(self.progress * total);
          wordNodes.forEach((node, index) => {
            node.dataset.active = index < activeCount ? "true" : "false";
          });
        },
      });

      if (side) {
        gsap.fromTo(
          side,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    },
    { scope: rootRef, dependencies: [content.headline] },
  );

  return (
    <section
      ref={rootRef}
      className={styles.section}
      aria-labelledby="about-manifesto-heading"
    >
      <div className={styles.layout}>
        <h2 id="about-manifesto-heading" className={styles.headline}>
          <span className="sr-only">{content.headline}</span>
          <span aria-hidden="true">
            {words.map((part, index) =>
              /^\s+$/.test(part) ? (
                <span key={`space-${index}`}> </span>
              ) : (
                <span
                  key={`${part}-${index}`}
                  className={styles.word}
                  data-manifesto-word
                >
                  {part}
                </span>
              ),
            )}
          </span>
        </h2>
        <div className={styles.side} data-manifesto-side>
          {content.sideHeading ? (
            <p className={styles.sideHeading}>{content.sideHeading}</p>
          ) : null}
          <p>{content.sideParagraph}</p>
        </div>
      </div>

      <MouseTrail
        images={ABOUT_TRAIL_IMAGES}
        imageWidth={140}
        imageHeight={200}
        stagger={0.03}
        duration={0.5}
        ease="power3.out"
        spawnDistance={120}
        minSeparation={90}
        maxVisibleImages={6}
        imageLifetimeMs={1100}
        exitDuration={0.7}
        pointerLeaveExitDuration={0.45}
        exitEase="power1.out"
        exitBlur={10}
        idleDelayMs={160}
      />
    </section>
  );
}
