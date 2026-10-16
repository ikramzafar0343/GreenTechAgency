"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/features/services/styles/serviceMedia.module.css";

type ServiceMediaWipeProps = {
  src: string | null;
  alt: string;
  title: string;
  /** Group label on the image tile (e.g. Development). */
  tileTitle: string;
  tileBrand?: string;
  active: boolean;
  reduceMotion: boolean;
  wipeKey: string;
};

export function ServiceMediaWipe({
  src,
  alt,
  title,
  tileTitle,
  tileBrand = "GREENTECH",
  active,
  reduceMotion,
  wipeKey,
}: ServiceMediaWipeProps) {
  const [loaded, setLoaded] = useState(!src);
  const shouldWipe = active && !reduceMotion && loaded;
  const wipeState = reduceMotion || !active ? "done" : shouldWipe ? "wiping" : "idle";
  const unoptimized =
    !src ||
    src.endsWith(".svg") ||
    src.startsWith("/media/") ||
    src.startsWith("http://") ||
    src.startsWith("https://");

  return (
    <div
      key={shouldWipe ? wipeKey : "parked"}
      className={styles.media}
      data-wipe={wipeState}
    >
      <div className={styles.backing} aria-hidden="true" />
      <div className={styles.imageClip}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 767px) 100vw, 375px"
            className={styles.image}
            unoptimized={unoptimized}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
          />
        ) : (
          <div className={styles.fallback} aria-hidden="true" title={title} />
        )}
      </div>
      {/* Outside wipe clip so the caption tile stays static. */}
      <div className={styles.tile} aria-hidden="true">
        <p className={styles.tileTitle}>{tileTitle}</p>
        <p className={styles.tileBrand}>{tileBrand}</p>
      </div>
    </div>
  );
}
