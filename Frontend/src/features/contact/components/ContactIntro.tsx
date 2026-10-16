"use client";

import { useRef } from "react";
import { CONTACT_INTRO } from "@/features/contact/model/contactPageContent";
import { useContactIntroMotion } from "@/features/contact/hooks/useContactIntroMotion";
import styles from "@/features/contact/styles/contactPage.module.css";

export function ContactIntro() {
  const rootRef = useRef<HTMLElement>(null);
  useContactIntroMotion(rootRef);

  return (
    <section
      id="contact-intro"
      className={styles.intro}
      ref={rootRef}
      aria-labelledby="contact-intro-heading"
      data-contact-intro
    >
      <p className={styles.introEyebrow} data-contact-intro-eyebrow>
        {CONTACT_INTRO.eyebrow}
      </p>
      <p
        id="contact-intro-heading"
        className={styles.introParagraph}
        data-contact-intro-copy
      >
        {CONTACT_INTRO.beforeHighlight}
        <span className={styles.introHighlight}>
          {CONTACT_INTRO.highlightPhrase}
        </span>
        {CONTACT_INTRO.afterHighlight}
      </p>
    </section>
  );
}
