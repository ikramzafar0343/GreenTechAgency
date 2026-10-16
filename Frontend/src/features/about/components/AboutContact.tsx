"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@/i18n/navigation";
import { useRef } from "react";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import type { AboutContactContent } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/styles/aboutContact.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AboutContactProps = {
  content: AboutContactContent;
};

export function AboutContact({ content }: AboutContactProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) {
        return;
      }

      const parts = root.querySelectorAll<HTMLElement>("[data-contact-reveal]");
      gsap.set(parts, { y: 22, opacity: 0 });
      gsap.to(parts, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className={styles.section} aria-labelledby="about-contact-heading">
      <div className={styles.inner}>
        <Link
          href={content.ctaHref}
          className={styles.cta}
          aria-label={content.ctaLabel}
        >
          <span className={styles.arrowWrap} data-contact-reveal>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </span>
          <span>
            <h2 id="about-contact-heading" className={styles.headline} data-contact-reveal>
              {content.headline}
            </h2>
            <p className={styles.support} data-contact-reveal>
              {content.supportingText}
            </p>
          </span>
        </Link>
      </div>
    </section>
  );
}
