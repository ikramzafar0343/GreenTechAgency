"use client";

import Image from "next/image";
import { useEffect, useRef, type RefObject } from "react";
import type {
  ServiceDetailImage,
  ServiceDetailPhotoPair as Pair,
} from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";

type Props = {
  pair: Pair;
  variant: "a" | "b";
};

function PairFrame({
  image,
  motionRef,
  sizes,
  offset = false,
}: {
  image: ServiceDetailImage;
  motionRef: RefObject<HTMLDivElement | null>;
  sizes: string;
  offset?: boolean;
}) {
  const unoptimized =
    image.src.endsWith(".svg") ||
    image.src.startsWith("/media/") ||
    image.src.startsWith("http://") ||
    image.src.startsWith("https://");

  return (
    <figure className={offset ? `${styles.pairFigure} ${styles.pairOffset}` : styles.pairFigure}>
      <div ref={motionRef} className={styles.pairMotion}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          unoptimized={unoptimized}
          className={styles.pairImage}
        />
        <div className={styles.pairTile} aria-hidden="true">
          <p className={styles.pairTileTitle}>{image.tileTitle}</p>
          <p className={styles.pairTileCaption}>{image.tileCaption}</p>
        </div>
      </div>
    </figure>
  );
}

export function ServiceDetailPhotoPair({ pair, variant }: Props) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) {
      return;
    }
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches
    ) {
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, 1 - rect.top / vh));
      const leftY = -24 + progress * 48;
      const rightY = 18 - progress * 36;
      left.style.transform = `translate3d(0, ${leftY}px, 0)`;
      right.style.transform = `translate3d(0, ${rightY}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) {
        raf = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${styles.editorial} ${styles.reveal}`}
      aria-label={
        variant === "a" ? "Service photography pair A" : "Service photography pair B"
      }
    >
      <div className={variant === "a" ? styles.pair : `${styles.pair} ${styles.pairB}`}>
        <PairFrame
          image={pair.left}
          motionRef={leftRef}
          sizes="(max-width: 767px) 100vw, 45vw"
        />
        <PairFrame
          image={pair.right}
          motionRef={rightRef}
          sizes="(max-width: 767px) 86vw, 36vw"
          offset
        />
      </div>
    </section>
  );
}
