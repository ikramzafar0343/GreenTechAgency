"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FiPause, FiPlay } from "react-icons/fi";
import type { HeroContent } from "@/features/hero/model/heroTypes";
import styles from "@/features/hero/styles/hero.module.css";

type HeroMediaProps = {
  media: HeroContent["media"];
};

export function HeroMedia({ media }: HeroMediaProps) {
  const t = useTranslations("common");
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setAllowMotion(!mediaQuery.matches);
    };
    syncMotion();
    mediaQuery.addEventListener("change", syncMotion);
    return () => mediaQuery.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const root = sectionRef.current;
    if (!video || !root || !allowMotion) {
      return;
    }

    let inView = true;

    const tryPlay = async () => {
      if (userPaused || document.hidden || !inView) {
        return;
      }
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    const pausePlayback = () => {
      video.pause();
      setIsPlaying(false);
    };

    const onVisibility = () => {
      if (document.hidden) {
        pausePlayback();
        return;
      }
      void tryPlay();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) {
          void tryPlay();
        } else {
          pausePlayback();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(root);
    document.addEventListener("visibilitychange", onVisibility);
    void tryPlay();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      pausePlayback();
    };
  }, [allowMotion, userPaused]);

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video || !allowMotion) {
      return;
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      setUserPaused(true);
      return;
    }

    setUserPaused(false);
    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div ref={sectionRef} className={styles.media}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.posterSrc}
        alt=""
        className={styles.poster}
        aria-hidden="true"
        decoding="async"
      />

      {allowMotion ? (
        <video
          ref={videoRef}
          className={`${styles.video} ${isReady ? styles.videoReady : ""}`}
          src={media.videoSrc}
          poster={media.posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedData={() => setIsReady(true)}
          onPlaying={() => {
            setIsReady(true);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
        />
      ) : null}

      <div className={styles.overlay} aria-hidden="true" />

      {allowMotion ? (
        <button
          type="button"
          className={styles.playback}
          onClick={() => {
            void handleToggle();
          }}
          aria-label={isPlaying ? t("pauseVideo") : t("playVideo")}
        >
          {isPlaying ? (
            <FiPause aria-hidden="true" className={styles.playbackIcon} />
          ) : (
            <FiPlay aria-hidden="true" className={styles.playbackIcon} />
          )}
        </button>
      ) : null}
    </div>
  );
}
