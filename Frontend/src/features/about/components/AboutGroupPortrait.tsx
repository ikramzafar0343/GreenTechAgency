"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutGroupPortraitContent } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutPortrait.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutGroupPortraitProps = {
  content: AboutGroupPortraitContent;
};

export function AboutGroupPortrait({ content }: AboutGroupPortraitProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) {
        return;
      }

      const clip = root.querySelector<HTMLElement>("[data-portrait-clip]");
      const media = root.querySelector<HTMLElement>("[data-portrait-media]");
      if (!clip || !media) {
        return;
      }

      gsap.set(clip, { clipPath: "inset(12% 0 12% 0)" });
      /* Keep scale > 1 so parallax travel cannot reveal a seam at the top/bottom. */
      gsap.set(media, { scale: 1.12 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            once: true,
          },
        })
        .to(clip, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out" }, 0)
        .to(media, { scale: 1.06, duration: 0.9, ease: "power3.out" }, 0);

      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (finePointer) {
        gsap.fromTo(
          media,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      }
    },
    { scope: rootRef },
  );

  const missing = content.assetStatus === "missing" || !content.src;
  const unoptimized =
    !!content.src &&
    (content.src.endsWith(".svg") ||
      content.src.startsWith("/media/") ||
      content.src.startsWith("http://") ||
      content.src.startsWith("https://"));

  return (
    <section
      ref={rootRef}
      id="about-group-portrait"
      className={styles.portrait}
      aria-label={missing ? "Team photograph pending approval" : content.alt}
      data-asset-status={content.assetStatus}
    >
      <div className={styles.clip} data-portrait-clip>
        <div className={styles.mediaWrap} data-portrait-media>
          {missing ? (
            <div className={styles.fallback} aria-hidden="true">
              <p className={styles.fallbackNote}>
                Approved group portrait pending — upload from Admin → Site
                sections → About page.
              </p>
            </div>
          ) : content.src ? (
            <Image
              src={content.src}
              alt={content.alt}
              fill
              sizes="100vw"
              className={styles.media}
              style={{ objectPosition: content.focalPoint }}
              priority={false}
              unoptimized={unoptimized}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
