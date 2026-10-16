"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CONTACT_ASSETS } from "@/features/contact/model/contactPageContent";
import { prefersReducedMotion } from "@/features/about/lib/prefersReducedMotion";
import styles from "@/features/contact/styles/contactChrome.module.css";

const FAILSAFE_MS = 1500;

export function ContactEntryOverlay() {
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      return;
    }

    let exitTimer: number | undefined;
    const start = window.setTimeout(() => {
      setExiting(true);
      exitTimer = window.setTimeout(() => setGone(true), 700);
    }, Math.min(FAILSAFE_MS, 400));

    const failsafe = window.setTimeout(() => {
      setExiting(true);
      setGone(true);
    }, FAILSAFE_MS);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(failsafe);
      if (exitTimer) window.clearTimeout(exitTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.overlayExit : ""}`}
      aria-hidden="true"
      data-contact-entry-overlay
    >
      <Image
        className={styles.overlayLogo}
        src={CONTACT_ASSETS.heroLogo}
        alt=""
        width={CONTACT_ASSETS.heroLogoWidth}
        height={CONTACT_ASSETS.heroLogoHeight}
        priority
      />
    </div>
  );
}
