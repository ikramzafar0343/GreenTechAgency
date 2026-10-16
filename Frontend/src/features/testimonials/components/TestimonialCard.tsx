"use client";

import { TestimonialQuote } from "@/features/testimonials/components/TestimonialQuote";
import type { TestimonialItem } from "@/features/testimonials/model/types";
import styles from "@/features/testimonials/styles/testimonialCards.module.css";

type TestimonialCardProps = {
  item: TestimonialItem;
  isOpen: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onRequestPin: () => void;
  onClose: () => void;
};

export function TestimonialCard({
  item,
  isOpen,
  isPinned,
  onTogglePin,
  onRequestPin,
  onClose,
}: TestimonialCardProps) {
  const panelId = `testimonial-panel-${item.id}`;
  const revealLabel = `Read review from ${item.reviewerName}, ${item.companyName}`;

  return (
    <article
      className={styles.card}
      data-open={isOpen ? "true" : "false"}
      data-pinned={isPinned ? "true" : "false"}
      onClick={(event) => {
        if (isPinned || !isOpen) {
          return;
        }
        const target = event.target as HTMLElement;
        if (target.closest("a, button")) {
          return;
        }
        onRequestPin();
      }}
    >
      <div className={styles.faces}>
        <div
          className={styles.front}
          aria-hidden={isOpen}
          inert={isOpen ? true : undefined}
        >
          {item.companyLogoUrl ? (
            <div className={styles.logoWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.companyLogoUrl}
                alt=""
                width={140}
                height={54}
                className={styles.logo}
                loading="lazy"
              />
            </div>
          ) : (
            <div className={styles.logoWrap} aria-hidden="true" />
          )}

          <h3 className={`${styles.companyName} typeCardTitle`}>
            {item.companyName}
          </h3>
          {item.location ? (
            <p className={`${styles.location} typeMeta`}>{item.location}</p>
          ) : null}

          <div
            className={
              item.reviewerPhotoUrl
                ? styles.reviewer
                : `${styles.reviewer} ${styles.reviewerNoPhoto}`
            }
          >
            {item.reviewerPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.reviewerPhotoUrl}
                alt=""
                width={48}
                height={48}
                className={styles.avatar}
                loading="lazy"
              />
            ) : null}
            <div className={styles.reviewerText}>
              <p className={`${styles.reviewerName} typeSmall`}>
                {item.reviewerName}
              </p>
              {item.reviewerRole ? (
                <p className={`${styles.reviewerRole} typeMeta`}>
                  {item.reviewerRole}
                </p>
              ) : null}
            </div>
          </div>

          <noscript>
            <p className={`${styles.noscriptQuote} typeBody`}>{item.quote}</p>
          </noscript>
        </div>

        <TestimonialQuote
          item={item}
          panelId={panelId}
          inert={!isOpen}
          ariaHidden={!isOpen}
        />
      </div>

      <button
        type="button"
        className={styles.revealButton}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={revealLabel}
        onClick={onTogglePin}
      />

      {isOpen ? (
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close review"
        >
          ×
        </button>
      ) : null}
    </article>
  );
}
