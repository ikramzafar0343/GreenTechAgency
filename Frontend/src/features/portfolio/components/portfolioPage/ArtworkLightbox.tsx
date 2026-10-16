"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import styles from "@/features/portfolio/styles/portfolioLightbox.module.css";

export type ArtworkLightboxState = {
  title: string;
  urls: readonly string[];
  index: number;
} | null;

type ArtworkLightboxProps = {
  state: ArtworkLightboxState;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

function subscribeNoop() {
  return () => undefined;
}

export function ArtworkLightbox({
  state,
  onClose,
  onIndexChange,
}: ArtworkLightboxProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const portalReady = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!state) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (!state) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight" && state.urls.length > 1) {
        event.preventDefault();
        onIndexChange((state.index + 1) % state.urls.length);
      }
      if (event.key === "ArrowLeft" && state.urls.length > 1) {
        event.preventDefault();
        onIndexChange((state.index - 1 + state.urls.length) % state.urls.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [state, onClose, onIndexChange]);

  if (!portalReady || !state) {
    return null;
  }

  const current = state.urls[state.index];
  if (!current) {
    return null;
  }

  return createPortal(
    <div
      className={`${styles.lightboxBackdrop} ${styles.lightboxBackdropOpen}`}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.lightboxDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.lightboxStage}>
          <button
            ref={closeRef}
            type="button"
            className={`${styles.lightboxClose} typeButton`}
            aria-label="Close gallery"
            onClick={onClose}
          >
            Close
          </button>
          {state.urls.length > 1 ? (
            <>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxPrev} typeButton`}
                aria-label="Previous image"
                onClick={() =>
                  onIndexChange(
                    (state.index - 1 + state.urls.length) % state.urls.length,
                  )
                }
              >
                Prev
              </button>
              <button
                type="button"
                className={`${styles.lightboxNav} ${styles.lightboxNext} typeButton`}
                aria-label="Next image"
                onClick={() =>
                  onIndexChange((state.index + 1) % state.urls.length)
                }
              >
                Next
              </button>
            </>
          ) : null}
          <Image
            src={current}
            alt=""
            width={1600}
            height={1200}
            className={styles.lightboxImage}
            sizes="90vw"
            priority
            unoptimized={
              current.startsWith("/media/") ||
              current.startsWith("http://") ||
              current.startsWith("https://") ||
              current.endsWith(".svg")
            }
          />
        </div>
        <div className={styles.lightboxMeta}>
          <p id={titleId} className="typeHeading">
            {state.title}
          </p>
          <p className="typeMeta">
            {state.index + 1} / {state.urls.length}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
