"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { MegaMenuLinkList } from "@/features/header/components/MegaMenuLinkList";
import { MegaMenuProof } from "@/features/header/components/MegaMenuProof";
import { useMegaMenuPanels } from "@/features/navigation/context/MegaMenuPanelsContext";
import { findMegaMenuPanel } from "@/features/navigation/model/megaMenuContent";
import type { MegaMenuId } from "@/features/navigation/model/navLinks";
import styles from "@/features/header/styles/megaMenu.module.css";

type MegaMenuPanelProps = {
  activeMenuId: MegaMenuId | null;
  isShown: boolean;
  headerElement: HTMLElement | null;
  onClose: () => void;
  onNavigate: () => void;
  onFocusInside: () => void;
  onFocusOutside: () => void;
  onPointerEnter: () => void;
  onPointerLeave: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

export function MegaMenuPanel({
  activeMenuId,
  isShown,
  headerElement,
  onClose,
  onNavigate,
  onFocusInside,
  onFocusOutside,
  onPointerEnter,
  onPointerLeave,
}: MegaMenuPanelProps) {
  const megaMenuPanels = useMegaMenuPanels();
  const panel = activeMenuId
    ? findMegaMenuPanel(megaMenuPanels, activeMenuId)
    : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [panelTop, setPanelTop] = useState(108);
  const contentKey = activeMenuId ?? "none";

  useLayoutEffect(() => {
    if (!headerElement) {
      return;
    }
    const update = () => {
      const rect = headerElement.getBoundingClientRect();
      setPanelTop(Math.round(rect.bottom + 20));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [headerElement, isShown]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [contentKey]);

  useEffect(() => {
    if (!isShown) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      const shell = document.getElementById("mega-menu-shell");
      const region = document.getElementById("mega-menu-region");
      if (target && !shell?.contains(target) && !region?.contains(target)) {
        onClose();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isShown, onClose]);

  const hasContent = Boolean(panel);
  const maxHeight = `calc(100dvh - ${panelTop}px - 2.5rem)`;

  return (
    <>
      <div
        className={`${styles.surround} ${isShown ? styles.surroundOpen : ""}`}
        aria-hidden="true"
      />
      {isShown ? (
        <div
          className={styles.bridge}
          style={{ top: Math.max(panelTop - 24, 0) }}
          aria-hidden="true"
          onPointerEnter={onPointerEnter}
        />
      ) : null}
      <div
        id="mega-menu-shell"
        className={`${styles.shell} ${isShown && hasContent ? styles.shellOpen : ""}`}
        style={{ top: panelTop, maxHeight }}
        aria-hidden={!isShown || !hasContent}
        {...(!isShown || !hasContent ? { inert: true } : {})}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocusCapture={onFocusInside}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            onFocusOutside();
          }
        }}
      >
        {panel ? (
          <div
            key={panel.id}
            id={panel.panelId}
            ref={scrollRef}
            role="region"
            aria-label={panel.label}
            className={styles.panel}
          >
            <div className={styles.layout}>
              <MegaMenuLinkList
                links={panel.links}
                interactive={isShown}
                onNavigate={onNavigate}
              />
              <div className={styles.spacer} aria-hidden="true" />
              <MegaMenuProof
                heading={panel.proofHeading}
                logos={panel.logos}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
