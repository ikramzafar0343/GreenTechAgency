"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { useMegaMenuController } from "@/features/header/hooks/useMegaMenuController";
import { useMegaMenuPanels } from "@/features/navigation/context/MegaMenuPanelsContext";
import { findMegaMenuPanel } from "@/features/navigation/model/megaMenuContent";
import { NAV_LINKS, type NavLinkId } from "@/features/navigation/model/navLinks";
import { Link } from "@/i18n/navigation";
import styles from "@/features/header/styles/headerControls.module.css";

const NAV_LABEL_KEYS: Record<
  NavLinkId,
  "about" | "services" | "insights" | "contact"
> = {
  about: "about",
  services: "services",
  blog: "insights",
  contact: "contact",
};

type MegaController = ReturnType<typeof useMegaMenuController>;

type DesktopNavigationProps = {
  mega: MegaController;
};

export function DesktopNavigation({ mega }: DesktopNavigationProps) {
  const t = useTranslations("navigation");
  const disclosureRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const megaMenuPanels = useMegaMenuPanels();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      const menuId = mega.activeMenuId;
      const closed = mega.handleEscape();
      if (!closed || !menuId) {
        return;
      }
      const panel = findMegaMenuPanel(megaMenuPanels, menuId);
      if (panel) {
        disclosureRefs.current[panel.disclosureId]?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mega, megaMenuPanels]);

  return (
    <nav
      id="mega-menu-region"
      aria-label={t("primary")}
      className={styles.desktopNav}
      onPointerEnter={mega.handleRegionEnter}
    >
      <ul className={styles.navList}>
        {NAV_LINKS.map((item) => {
          const label = t(NAV_LABEL_KEYS[item.id]);
          if (!item.megaMenuId) {
            return (
              <li key={item.id} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={`${styles.navControl} typeNav`}
                  onClick={() => mega.closeNow()}
                >
                  {label}
                </Link>
              </li>
            );
          }

          const menuId = item.megaMenuId;
          const panel = findMegaMenuPanel(megaMenuPanels, menuId);
          const isActive = mega.isOpen && mega.activeMenuId === menuId;

          return (
            <li
              key={item.id}
              className={styles.navItem}
              onPointerEnter={(event) =>
                mega.handleTriggerEnter(menuId, event)
              }
              onPointerLeave={mega.handleTriggerLeave}
            >
              <div className={styles.navTriggerGroup}>
                <Link
                  href={item.href}
                  className={`${styles.navControl} typeNav ${
                    isActive ? styles.navControlActive : ""
                  }`}
                  onClick={() => mega.closeNow()}
                >
                  {label}
                </Link>
                <button
                  type="button"
                  ref={(node) => {
                    if (panel) {
                      disclosureRefs.current[panel.disclosureId] = node;
                    }
                  }}
                  id={panel?.disclosureId}
                  className={styles.navDisclosure}
                  aria-label={t("openServices")}
                  aria-expanded={isActive}
                  aria-controls={panel?.panelId}
                  onClick={() => mega.toggleMenu(menuId)}
                  onPointerEnter={(event) =>
                    mega.handleTriggerEnter(menuId, event)
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
