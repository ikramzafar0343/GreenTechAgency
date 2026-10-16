"use client";

import { useRef } from "react";
import {
  CONTACT_ASSETS,
  CONTACT_BRAND_NAME,
  CONTACT_HERO_LINES,
} from "@/features/contact/model/contactPageContent";
import { useContactHeroMotion } from "@/features/contact/hooks/useContactHeroMotion";
import styles from "@/features/contact/styles/contactPage.module.css";

export function ContactHero() {
  const rootRef = useRef<HTMLElement>(null);
  useContactHeroMotion(rootRef);

  return (
    <section
      ref={rootRef}
      className={styles.contactHero}
      aria-labelledby="contact-hero-title"
      data-contact-hero
    >
      <h1 id="contact-hero-title" className={styles.visuallyHidden}>
        Contact {CONTACT_BRAND_NAME}
      </h1>

      <a
        className={styles.scrollCue}
        href="#contact-enquiry"
        data-contact-scroll-cue
      >
        Scroll
      </a>

      <p
        className={styles.description}
        data-contact-hero-copy
      >
        {CONTACT_HERO_LINES.map((line, index) => (
          <span key={line}>
            <span data-contact-hero-line className={styles.heroLineMask}>
              <span data-contact-hero-line-inner>{line}</span>
            </span>
            {index < CONTACT_HERO_LINES.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>

      <div className={styles.heroComposition} data-contact-hero-composition>
        <div className={styles.heroWordBlock}>
          <p
            className={styles.heading}
            aria-hidden="true"
            data-contact-hero-wordmark
          >
            contact
          </p>

          <div
            className={styles.logoLayer}
            aria-hidden="true"
            data-contact-hero-logo-frame
          >
            <div data-contact-hero-logo-motion className={styles.logoMotion}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.logoImage}
                src={CONTACT_ASSETS.heroLogo}
                alt=""
                width={CONTACT_ASSETS.heroLogoWidth}
                height={CONTACT_ASSETS.heroLogoHeight}
                data-contact-hero-logo-image
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
