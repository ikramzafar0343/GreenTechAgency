"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef } from "react";

import type { AstronautCtaContent } from "@/features/cta/model/astronautCtaContent";
import styles from "@/features/cta/styles/astronautCta.module.css";

type AstronautCtaSectionProps = {
  content: AstronautCtaContent;
};

export function AstronautCtaSection({ content }: AstronautCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      return;
    }

    node.dataset.motion = "float";

    const markEntered = () => {
      node.dataset.entered = "true";
    };

    const inView =
      node.getBoundingClientRect().top < window.innerHeight * 0.92 &&
      node.getBoundingClientRect().bottom > 0;

    node.dataset.ready = "true";

    if (inView) {
      requestAnimationFrame(() => {
        requestAnimationFrame(markEntered);
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        markEntered();
        observer.disconnect();
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="astronaut-cta-heading"
    >
      <div className={styles.gridLayer} aria-hidden="true" />
      <div className={styles.stars} aria-hidden="true">
        <span className={styles.star} />
        <span className={styles.star} />
        <span className={styles.star} />
        <span className={styles.star} />
        <span className={styles.star} />
      </div>
      <div className={styles.haze} aria-hidden="true" />
      <div className={styles.hazeBottom} aria-hidden="true" />

      <div className={styles.stage}>
        <div className={styles.left}>
          <p className={`${styles.eyebrow} typeEyebrow ${styles.enterItem}`}>
            {content.eyebrow}
          </p>
          <h2
            id="astronaut-cta-heading"
            className={`${styles.heading} typeSectionTitle ${styles.enterItem}`}
          >
            {content.heading}
          </h2>
        </div>

        <div className={styles.mediaPosition} aria-hidden="true">
          <div className={styles.mediaFloat}>
            <Image
              src={content.imageSrc}
              alt=""
              width={content.imageWidth}
              height={content.imageHeight}
              className={styles.artImage}
              sizes="(max-width: 1023px) min(100vw, 590px), clamp(650px, 53vw, 900px)"
              priority={false}
            />
          </div>
        </div>

        <div className={`${styles.right} ${styles.enterItem}`}>
          <p className={`${styles.body} typeLead`}>{content.paragraphs[0]}</p>
          <p className={`${styles.body} typeLead`}>{content.paragraphs[1]}</p>
          <Link
            href={content.ctaHref}
            className={`${styles.button} typeButton ${styles.enterItem}`}
          >
            {content.ctaLabel}
            <span className={styles.buttonArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
