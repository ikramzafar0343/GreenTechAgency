"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { BRAND_COPY } from "@/features/brands/model/brandLogos";
import styles from "@/features/brands/styles/brandFamily.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type BrandHeadingProps = {
  reduceMotion: boolean;
};

export function BrandHeading({ reduceMotion }: BrandHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reduceMotion) {
        return;
      }

      const eyebrowInners = root.querySelectorAll<HTMLElement>(
        `[data-eyebrow-inner]`,
      );
      const lines = root.querySelectorAll<HTMLElement>(`[data-title-line]`);
      const chars = root.querySelectorAll<HTMLElement>(`[data-char]`);

      gsap.set(eyebrowInners, { yPercent: 110 });
      gsap.set(lines, {
        yPercent: 100,
        rotateX: -105,
        skewY: -2,
        scale: 0.8,
        opacity: 0,
        transformOrigin: "center bottom",
      });
      gsap.set(chars, { color: "#dddddd" });

      const run = async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 90%",
              once: true,
            },
          })
          .to(eyebrowInners, {
            yPercent: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "power3.inOut",
          });

        const characterCount = chars.length;
        const lineCount = Math.max(lines.length, 1);
        const characterSequence = 1 + 0.01 * Math.max(characterCount - 1, 0);
        const lineDuration = Math.max(
          0.1,
          characterSequence + 0.25 - 0.1 - 0.07 * (lineCount - 1),
        );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 89%",
              once: true,
            },
          })
          .to(
            lines,
            {
              yPercent: 0,
              rotateX: 0,
              skewY: 0,
              scale: 1,
              opacity: 1,
              duration: lineDuration,
              stagger: 0.07,
              delay: 0.1,
              ease: "power4.out",
            },
            0,
          )
          .to(
            chars,
            {
              color: "var(--brand-cyan)",
              duration: 0.5,
              stagger: 0.01,
              ease: "none",
            },
            0.1,
          )
          .to(
            chars,
            {
              color: "#000000",
              duration: 0.5,
              stagger: 0.01,
              ease: "none",
            },
            0.6,
          );
      };

      void run();
    },
    { scope: rootRef, dependencies: [reduceMotion] },
  );

  const eyebrowWords = BRAND_COPY.eyebrow.split(" ");
  const lineOneChars = Array.from(BRAND_COPY.titleLineOne);
  const lineTwoChars = Array.from(BRAND_COPY.titleLineTwo);

  return (
    <div ref={rootRef} className={styles.heading}>
      <p
        className={`${styles.eyebrow} typeEyebrow`}
        aria-label={BRAND_COPY.eyebrow}
      >
        {eyebrowWords.map((word) => (
          <span key={word} className={styles.eyebrowWord} aria-hidden="true">
            <span data-eyebrow-inner className={styles.eyebrowInner}>
              {word}
            </span>
          </span>
        ))}
      </p>

      <h2
        id="brand-family-title"
        className={`${styles.title} typeSectionTitle`}
      >
        <span className="sr-only">
          {BRAND_COPY.titleLineOne} {BRAND_COPY.titleLineTwo}
        </span>
        <span className={styles.titleMask} aria-hidden="true">
          <span data-title-line className={styles.titleLine}>
            {lineOneChars.map((char, index) => (
              <span
                key={`a-${index}-${char}`}
                data-char
                className={styles.char}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </span>
        <span className={styles.titleMask} aria-hidden="true">
          <span data-title-line className={styles.titleLine}>
            {lineTwoChars.map((char, index) => (
              <span
                key={`b-${index}-${char}`}
                data-char
                className={styles.char}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </span>
      </h2>
    </div>
  );
}
