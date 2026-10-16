"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FiPause, FiPlay } from "react-icons/fi";
import { BrandHeading } from "@/features/brands/components/BrandHeading";
import { BrandMarqueeRow } from "@/features/brands/components/BrandMarqueeRow";
import { useBrandMarquee } from "@/features/brands/hooks/useBrandMarquee";
import { BRAND_ROWS } from "@/features/brands/model/brandLogos";
import styles from "@/features/brands/styles/brandFamily.module.css";

export function BrandFamilySection() {
  const t = useTranslations("common");
  const sectionRef = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useBrandMarquee(sectionRef, {
    enabled: !reduceMotion,
    paused,
  });

  const uniqueLogos = useMemo(() => {
    const seen = new Set<string>();
    const logos: (typeof BRAND_ROWS)[number]["logos"][number][] = [];
    for (const row of BRAND_ROWS) {
      for (const logo of row.logos) {
        if (seen.has(logo.src)) {
          continue;
        }
        seen.add(logo.src);
        logos.push(logo);
      }
    }
    return logos;
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${reduceMotion ? styles.reduceMotion : ""}`}
      aria-labelledby="brand-family-title"
    >
      <BrandHeading reduceMotion={reduceMotion} />

      <div className={styles.rows} aria-hidden={reduceMotion}>
        {BRAND_ROWS.map((row) => (
          <BrandMarqueeRow
            key={row.id}
            row={row}
            exposeNames={row.id === "upper"}
          />
        ))}
      </div>

      <ul
        className={styles.staticGrid}
        aria-hidden={reduceMotion ? undefined : true}
      >
        {uniqueLogos.map((logo) => (
          <li key={logo.src} className={styles.staticItem}>
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className={styles.staticImg}
              sizes="96px"
            />
          </li>
        ))}
      </ul>

      {!reduceMotion ? (
        <button
          type="button"
          className={styles.pause}
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
        >
          {paused ? (
            <FiPlay aria-hidden="true" />
          ) : (
            <FiPause aria-hidden="true" />
          )}
          {paused ? t("playLogos") : t("pauseLogos")}
        </button>
      ) : null}
    </section>
  );
}
