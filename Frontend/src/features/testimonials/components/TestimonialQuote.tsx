import { splitQuoteWithEmphasis } from "@/features/testimonials/model/quoteMarkup";
import type { TestimonialItem } from "@/features/testimonials/model/types";
import styles from "@/features/testimonials/styles/testimonialCards.module.css";

type TestimonialQuoteProps = {
  item: TestimonialItem;
  panelId: string;
  className?: string | undefined;
  inert?: boolean | undefined;
  ariaHidden?: boolean | undefined;
};

function starLabel(rating: number, scale: number) {
  const filled = Math.round(rating);
  return "★".repeat(filled) + "☆".repeat(Math.max(0, scale - filled));
}

export function TestimonialQuote({
  item,
  panelId,
  className,
  inert: isInert,
  ariaHidden,
}: TestimonialQuoteProps) {
  const parts = splitQuoteWithEmphasis(item.quote, item.emphasisText);
  const panelClassName = className
    ? `${styles.back} ${className}`
    : styles.back;

  return (
    <div
      className={panelClassName}
      id={panelId}
      aria-hidden={ariaHidden}
      inert={isInert ? true : undefined}
    >
      <div className={styles.quoteBody}>
        {item.rating !== null ? (
          <p
            className={`${styles.rating} typeSmall`}
            aria-label={`${item.rating} out of ${item.ratingScale}`}
          >
            {starLabel(item.rating, item.ratingScale)}
          </p>
        ) : null}

        <blockquote className={`${styles.quote} typeQuote`}>
          {parts ? (
            <>
              {parts.before}
              <strong className={styles.emphasis}>{parts.emphasis}</strong>
              {parts.after}
            </>
          ) : (
            item.quote
          )}
        </blockquote>
      </div>

      <div className={styles.quoteFooter}>
        <p className={`${styles.attribution} typeMeta`}>
          {item.reviewerName}
          {item.reviewerRole ? `, ${item.reviewerRole}` : ""}
          {item.companyName ? ` · ${item.companyName}` : ""}
        </p>
        {item.sourceUrl ? (
          <a
            className={`${styles.sourceLink} typeButton`}
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={ariaHidden ? -1 : undefined}
            onClick={(event) => event.stopPropagation()}
          >
            Read original review
          </a>
        ) : null}
      </div>
    </div>
  );
}
