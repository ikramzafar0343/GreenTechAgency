"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { navigateFromMenu } from "@/features/header/utils/navigateFromMenu";
import { useMegaMenuPanels } from "@/features/navigation/context/MegaMenuPanelsContext";
import { findMegaMenuPanel } from "@/features/navigation/model/megaMenuContent";
import {
  NAV_LINKS,
  type MegaMenuId,
  type NavLinkId,
} from "@/features/navigation/model/navLinks";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import styles from "@/features/header/styles/headerMenus.module.css";

const NAV_LABEL_KEYS: Record<
  NavLinkId,
  "about" | "services" | "insights" | "contact"
> = {
  about: "about",
  services: "services",
  blog: "insights",
  contact: "contact",
};

type MobileNavigationProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNavigation({
  isOpen,
  onClose,
}: MobileNavigationProps) {
  const t = useTranslations("navigation");
  const tCta = useTranslations("cta");
  const router = useRouter();
  const pathname = usePathname();
  const megaMenuPanels = useMegaMenuPanels();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [childMenuId, setChildMenuId] = useState<MegaMenuId | null>(null);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen && childMenuId !== null) {
      setChildMenuId(null);
    }
  }

  const childPanel = childMenuId
    ? findMegaMenuPanel(megaMenuPanels, childMenuId)
    : undefined;

  const pathAtOpen = useRef(pathname);
  useEffect(() => {
    if (!isOpen) {
      pathAtOpen.current = pathname;
      return;
    }
    if (pathname !== pathAtOpen.current) {
      onClose();
    }
  }, [isOpen, onClose, pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (childMenuId) {
          setChildMenuId(null);
          return;
        }
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [childMenuId, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`${styles.drawer} ${styles.drawerOpen}`}>
      <button
        type="button"
        className={styles.drawerBackdrop}
        aria-label={t("closeMenu")}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={styles.drawerPanel}
      >
        <h2 id={titleId} className="sr-only">
          {t("siteNavigation")}
        </h2>

        <div
          className={`${styles.drawerStack} ${
            childPanel ? styles.drawerStackChild : ""
          }`}
        >
          <nav aria-label={t("mobile")} className={styles.drawerNav}>
            {NAV_LINKS.map((item) => {
              const label = t(NAV_LABEL_KEYS[item.id]);
              if (item.megaMenuId) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.drawerButton} typeNav`}
                    onClick={() => setChildMenuId(item.megaMenuId!)}
                  >
                    <span>{label}</span>
                    <HiChevronRight aria-hidden="true" />
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${styles.drawerLink} typeNav`}
                  onClick={(event) =>
                    navigateFromMenu(event, item.href, router, onClose)
                  }
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {childPanel ? (
            <div className={styles.drawerChild} aria-label={t("services")}>
              <button
                type="button"
                className={`${styles.drawerBack} typeNav`}
                onClick={() => setChildMenuId(null)}
              >
                <HiChevronLeft aria-hidden="true" />
                <span>{t("back")}</span>
              </button>
              <Link
                href={
                  NAV_LINKS.find((item) => item.megaMenuId === childPanel.id)
                    ?.href ?? "/services"
                }
                className={`${styles.drawerLink} typeNav`}
                onClick={(event) => {
                  const href =
                    NAV_LINKS.find((item) => item.megaMenuId === childPanel.id)
                      ?.href ?? "/services";
                  navigateFromMenu(event, href, router, onClose);
                }}
              >
                {t("allServices")}
              </Link>
              {childPanel.links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`${styles.drawerLink} typeNav`}
                  onClick={(event) =>
                    navigateFromMenu(event, link.href, router, onClose)
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <Link
          href="/portfolio"
          className={`${styles.drawerCta} typeButton`}
          onClick={(event) =>
            navigateFromMenu(event, "/portfolio", router, onClose)
          }
        >
          {tCta("portfolio")}
        </Link>
      </div>
    </div>
  );
}
