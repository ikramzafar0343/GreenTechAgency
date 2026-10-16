"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ContactMenu } from "@/features/contact/components/ContactMenu";
import {
  CONTACT_HEADER,
  CONTACT_MENU_LINKS,
} from "@/features/contact/model/contactNav";
import { CONTACT_BRAND_NAME } from "@/features/contact/model/contactPageContent";
import styles from "@/features/contact/styles/contactChrome.module.css";

export function ContactHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brandHidden, setBrandHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    function onScroll() {
      setBrandHidden(window.scrollY > CONTACT_HEADER.brandHideScrollPx);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className={styles.headerShell} data-contact-header>
        <div className={styles.headerInner}>
          <Link
            href="/"
            className={`${styles.brand} ${brandHidden ? styles.brandHidden : ""}`}
            aria-label={CONTACT_BRAND_NAME}
          >
            <Image
              src="/images/brand/logo-mark.png"
              alt=""
              width={48}
              height={48}
              className={styles.brandLogo}
              priority
            />
            <span className={styles.brandText} aria-hidden="true">
              <span className={styles.brandEyebrow}>GreenTech</span>
              <span className={styles.brandName}>Agency</span>
            </span>
          </Link>

          <div className={styles.controls}>
            <Link
              href={CONTACT_HEADER.portfolioHref}
              className={styles.portfolioPill}
            >
              <span>{CONTACT_HEADER.portfolioLabel}</span>
              <span className={styles.pillBadge} aria-hidden="true">
                <span className={styles.portfolioArrow}>→</span>
              </span>
            </Link>

            <button
              ref={toggleRef}
              type="button"
              className={styles.menuToggle}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={styles.menuLabelWindow} aria-hidden="true">
                <span
                  className={`${styles.menuLabelStack} ${
                    menuOpen ? styles.menuLabelStackOpen : ""
                  }`}
                >
                  <span>{CONTACT_HEADER.menuOpenLabel}</span>
                  <span>{CONTACT_HEADER.menuCloseLabel}</span>
                </span>
              </span>
              <span className={styles.visuallyHidden}>
                {menuOpen
                  ? CONTACT_HEADER.menuCloseLabel
                  : CONTACT_HEADER.menuOpenLabel}
              </span>
              <span className={styles.pillBadge} aria-hidden="true">
                <span className={styles.menuDots}>
                  <span />
                  <span />
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <ContactMenu
        id={menuId}
        open={menuOpen}
        links={CONTACT_MENU_LINKS}
        onClose={() => {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }}
      />
    </>
  );
}
