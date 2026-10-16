import styles from "@/features/about/styles/aboutServices.module.css";
import type { AboutServiceRow } from "@/features/about/model/aboutPageTypes";

type AboutServiceIconProps = {
  name: AboutServiceRow["iconName"];
};

export function AboutServiceIcon({ name }: AboutServiceIconProps) {
  switch (name) {
    case "design":
      return (
        <svg className={styles.icon} viewBox="0 0 64 64" aria-hidden="true">
          <rect x="10" y="14" width="44" height="36" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M10 24h44M26 24v26" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "code":
      return (
        <svg className={styles.icon} viewBox="0 0 64 64" aria-hidden="true">
          <path d="M24 18 12 32l12 14M40 18l12 14-12 14M36 14 28 50" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "growth":
      return (
        <svg className={styles.icon} viewBox="0 0 64 64" aria-hidden="true">
          <path d="M12 44 28 28l10 10 14-18" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M40 20h12v12" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "brand":
      return (
        <svg className={styles.icon} viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="32" cy="32" r="6" fill="currentColor" />
        </svg>
      );
    case "tech":
      return (
        <svg className={styles.icon} viewBox="0 0 64 64" aria-hidden="true">
          <rect x="18" y="18" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M32 10v8M32 46v8M10 32h8M46 32h8" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    default:
      return null;
  }
}
