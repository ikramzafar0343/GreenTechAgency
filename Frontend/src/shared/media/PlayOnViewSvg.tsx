"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactEventHandler,
} from "react";
import styles from "@/shared/media/PlayOnViewSvg.module.css";

export type PlayOnViewSvgProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  unoptimized?: boolean;
  onLoad?: ReactEventHandler<HTMLImageElement>;
  onError?: ReactEventHandler<HTMLImageElement>;
};

function isSvgSrc(src: string) {
  const path = src.split("?")[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg");
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function prepareSvgMarkup(raw: string, alt: string) {
  const cleaned = raw
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");

  // Always `meet` so full illustrations (cards, charts, shadows) stay visible —
  // never crop with `slice` / object-fit cover.
  return cleaned.replace(/<svg\b([^>]*)>/i, (_, attrs: string) => {
    let next = attrs
      .replace(/\s(width|height)=("|' )?[^"'\s>]+("|' )?/gi, "")
      .replace(/\spreserveAspectRatio=("|' )[^"']*("|' )/gi, "")
      .replace(/\soverflow=("|' )[^"']*("|' )/gi, "");
    if (!/\brole=/i.test(next)) {
      next += ' role="img"';
    }
    next += ' preserveAspectRatio="xMidYMid meet" overflow="visible"';
    next += ` aria-label="${escapeAttr(alt)}"`;
    return `<svg${next}>`;
  });
}

/**
 * Inlines marketing SVGs so entrance CSS (typewriter, graph draw, etc.) can
 * run when `class="play"` is set on scroll into view.
 */
export function PlayOnViewSvg({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  style,
  unoptimized,
  onLoad,
  onError,
}: PlayOnViewSvgProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [markup, setMarkup] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const useImageFallback = !isSvgSrc(src) || failed || reduceMotion;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isSvgSrc(src) || reduceMotion) {
      return;
    }

    let cancelled = false;
    setFailed(false);
    setMarkup(null);

    fetch(src)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`SVG fetch failed: ${res.status}`);
        }
        const text = await res.text();
        if (!/<svg[\s>]/i.test(text)) {
          throw new Error("Response was not an SVG");
        }
        if (!cancelled) {
          setMarkup(prepareSvgMarkup(text, alt));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [src, alt, reduceMotion]);

  useEffect(() => {
    if (!markup || !onLoad) {
      return;
    }
    onLoad({} as Parameters<NonNullable<typeof onLoad>>[0]);
  }, [markup, onLoad]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !markup) {
      return;
    }

    const svg = host.querySelector("svg");
    if (!svg) {
      return;
    }

    const play = () => svg.classList.add("play");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [markup]);

  if (useImageFallback) {
    const imageUnoptimized =
      unoptimized ??
      (src.endsWith(".svg") ||
        src.startsWith("/media/") ||
        src.startsWith("http://") ||
        src.startsWith("https://"));

    const fitStyle: CSSProperties = isSvgSrc(src)
      ? { objectFit: "contain", objectPosition: "center", ...style }
      : { ...style };

    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          style={fitStyle}
          priority={priority}
          unoptimized={imageUnoptimized}
          onLoad={onLoad}
          onError={onError}
        />
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 900}
        sizes={sizes}
        className={className}
        style={fitStyle}
        priority={priority}
        unoptimized={imageUnoptimized}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  const hostClass = [styles.host, className].filter(Boolean).join(" ");
  const sizedStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0 }
    : {
        display: "block",
        width: "100%",
        height: "auto",
        ...(width && height
          ? { aspectRatio: `${width} / ${height}` }
          : undefined),
      };

  if (!markup) {
    return (
      <div
        className={hostClass}
        style={{
          ...sizedStyle,
          ...style,
          background:
            "linear-gradient(135deg, #0b1d2e 0%, #10324a 55%, #0f2a40 100%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={hostRef}
      className={hostClass}
      style={{
        ...sizedStyle,
        ...style,
        lineHeight: 0,
      }}
      // Generated media-art SVGs are trusted static assets (scripts stripped).
      dangerouslySetInnerHTML={{ __html: markup }}
      role="img"
      aria-label={alt}
    />
  );
}
