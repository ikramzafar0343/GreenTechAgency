import type { AboutServiceRow } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/components/exploreServices/aboutExploreServices.module.css";

type ExploreServiceVisualProps = {
  service: AboutServiceRow;
};

function VisualMark({ name }: { name: AboutServiceRow["iconName"] }) {
  switch (name) {
    case "design":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="22" cy="22" r="7" fill="currentColor" />
          <circle cx="42" cy="22" r="7" fill="currentColor" />
          <circle cx="22" cy="42" r="7" fill="currentColor" />
          <circle cx="42" cy="42" r="7" fill="currentColor" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M24 18 12 32l12 14M40 18l12 14-12 14M36 14 28 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
      );
    case "growth":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M12 44 28 28l10 10 14-18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            d="M40 20h12v12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
      );
    case "brand":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="6" fill="currentColor" />
        </svg>
      );
    case "tech":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="18" y="18" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M32 10v8M32 46v8M10 32h8M46 32h8" stroke="currentColor" strokeWidth="2.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function ExploreServiceVisual({ service }: ExploreServiceVisualProps) {
  return (
    <div className={styles.visual} aria-hidden="true" data-service-visual>
      <div className={styles.visualTexture} />
      <div className={styles.visualMark}>
        <VisualMark name={service.iconName} />
      </div>
    </div>
  );
}
