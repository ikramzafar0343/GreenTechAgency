"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { ServiceDetailImage } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type Props = {
  image: ServiceDetailImage;
};

export function ServiceDetailLeadPhoto({ image }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) {
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (reduce || !desktop) {
      frame.style.width = "100%";
      inner.style.transform = "none";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.95;
      const end = vh * 0.25;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      const width = 82 + progress * 18;
      const scale = 1 + (1 - progress) * 0.04;
      frame.style.width = `${width}%`;
      inner.style.transform = `scale(${scale})`;
    };

    const onScroll = () => {
      if (!raf) {
        raf = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <div className={`${styles.leadShell} ${styles.reveal}`}>
      <div ref={frameRef} className={styles.leadFrame} style={{ width: "82%" }}>
        <div ref={innerRef} className={styles.leadInner}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className={styles.leadImage}
            sizes="(max-width: 767px) 100vw, min(1600px, 100vw)"
            priority
            unoptimized
          />
          {image.tileTitle ? (
            <div className={styles.pairTile} aria-hidden="true">
              <p className={styles.pairTileTitle}>{image.tileTitle}</p>
              <p className={styles.pairTileCaption}>{image.tileCaption}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
