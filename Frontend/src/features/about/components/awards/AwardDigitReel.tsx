"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import styles from "@/features/about/components/awards/aboutAwards.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AwardDigitReelProps = {
  value: number;
  padLength?: number;
  suffix?: string;
  className?: string;
  ariaLabel?: string;
};

function digitsFor(value: number, padLength: number) {
  const raw = Math.max(0, Math.floor(value)).toString();
  return raw.padStart(Math.max(padLength, raw.length), "0").split("").map(Number);
}

function measureSlot(reel: HTMLElement) {
  const glyph = reel.querySelector<HTMLElement>("[data-award-glyph]");
  return (
    glyph?.getBoundingClientRect().height ||
    reel.parentElement?.getBoundingClientRect().height ||
    1
  );
}

export function AwardDigitReel({
  value,
  padLength = 3,
  suffix = "",
  className,
  ariaLabel,
}: AwardDigitReelProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);
  const digits = digitsFor(value, padLength);
  const finalText = `${digits.join("")}${suffix}`;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reels = [
        ...root.querySelectorAll<HTMLElement>("[data-award-reel]"),
      ];
      if (reels.length === 0) return;

      const finish = () => {
        reels.forEach((reel, index) => {
          gsap.set(reel, {
            y: -(digits[index] ?? 0) * measureSlot(reel),
          });
        });
        playedRef.current = true;
      };

      if (playedRef.current || prefersReducedMotion()) {
        finish();
        return;
      }

      if (root.getBoundingClientRect().top < window.innerHeight) {
        finish();
        return;
      }

      reels.forEach((reel) => gsap.set(reel, { y: 0 }));

      let tl: gsap.core.Timeline | null = null;

      const play = () => {
        if (playedRef.current) {
          finish();
          return;
        }
        tl?.kill();
        tl = gsap.timeline({
          onComplete: () => {
            playedRef.current = true;
          },
        });
        reels.forEach((reel, index) => {
          tl!.to(
            reel,
            {
              y: -(digits[index] ?? 0) * measureSlot(reel),
              duration: 1,
              ease: "expo.inOut",
            },
            index * 0.1,
          );
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        once: true,
        onEnter: play,
      });

      return () => {
        trigger.kill();
        tl?.kill();
      };
    },
    { scope: rootRef, dependencies: [value, padLength, suffix] },
  );

  return (
    <span
      ref={rootRef}
      className={[styles.digitGroup, className].filter(Boolean).join(" ")}
      aria-label={ariaLabel || undefined}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {ariaLabel ? <span className="sr-only">{finalText}</span> : null}
      <span className={styles.digitVisual} aria-hidden="true">
        {digits.map((digit, index) => (
          <span key={`slot-${index}`} className={styles.digitWindow}>
            <span className={styles.digitReel} data-award-reel>
              {Array.from({ length: digit + 1 }, (_, n) => (
                <span key={n} className={styles.digitGlyph} data-award-glyph>
                  {n}
                </span>
              ))}
            </span>
          </span>
        ))}
        {suffix ? <span className={styles.digitSuffix}>{suffix}</span> : null}
      </span>
    </span>
  );
}
