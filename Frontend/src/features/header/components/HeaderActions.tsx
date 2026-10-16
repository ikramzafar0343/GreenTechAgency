"use client";

import { useTranslations } from "next-intl";
import { FiMail, FiPhone } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import styles from "@/features/header/styles/headerControls.module.css";

type HeaderActionsProps = {
  onContactClick: () => void;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
};

export function HeaderActions({
  onContactClick,
  isMenuOpen,
  onMenuToggle,
}: HeaderActionsProps) {
  const t = useTranslations();

  return (
    <div className={styles.actions}>
      <Link href="/portfolio" className={`${styles.cta} typeButton`}>
        <span className={styles.ctaBase} aria-hidden="true" />
        <span className={styles.ctaHover} aria-hidden="true" />
        <span className={styles.ctaLabel}>{t("cta.portfolio")}</span>
      </Link>

      <button
        type="button"
        className={styles.contact}
        aria-label={t("cta.contactEmail")}
        onClick={onContactClick}
      >
        <span className={styles.contactFill} aria-hidden="true" />
        <FiMail aria-hidden="true" className={styles.contactIcon} />
      </button>

      <button
        type="button"
        className={styles.contact}
        aria-label={t("cta.contactPhone")}
        onClick={onContactClick}
      >
        <span className={styles.contactFill} aria-hidden="true" />
        <FiPhone aria-hidden="true" className={styles.contactIcon} />
      </button>

      <button
        type="button"
        className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ""}`}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-label={isMenuOpen ? t("navigation.closeMenu") : t("navigation.openMenu")}
        onClick={onMenuToggle}
      >
        <span className={styles.menuToggleBars} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}
