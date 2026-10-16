"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 40;

type UseServiceCarouselOptions = {
  total: number;
  groupVisible: boolean;
  reduceMotion: boolean;
};

export function useServiceCarousel({
  total,
  groupVisible,
  reduceMotion,
}: UseServiceCarouselOptions) {
  const [index, setIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(
    () => total > 1 && !reduceMotion,
  );
  const touchStartX = useRef<number | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (total > 1 && !reduceMotion) {
      setAutoplayEnabled(true);
    } else {
      setAutoplayEnabled(false);
    }
  }, [total, reduceMotion]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total <= 1) {
        return;
      }
      const wrapped = ((nextIndex % total) + total) % total;
      setIndex(wrapped);
    },
    [total],
  );

  const canAutoplay =
    autoplayEnabled && !reduceMotion && total > 1 && groupVisible;

  useEffect(() => {
    if (!canAutoplay) {
      return;
    }
    const timer = window.setTimeout(() => {
      goTo(indexRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [canAutoplay, index, goTo]);

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX == null || total <= 1) {
      return;
    }
    const delta = clientX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }
    if (delta < 0) {
      goTo(indexRef.current + 1);
    } else {
      goTo(indexRef.current - 1);
    }
  };

  return {
    index,
    autoplay: canAutoplay,
    goTo,
    onTouchStart,
    onTouchEnd,
    pauseAutoplay: () => setAutoplayEnabled(false),
    resumeAutoplay: () => {
      if (!reduceMotion && total > 1) {
        setAutoplayEnabled(true);
      }
    },
  };
}
