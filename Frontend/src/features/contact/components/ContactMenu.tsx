"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "@/features/contact/styles/contactChrome.module.css";

type MenuLink = {
  id: string;
  label: string;
  href: string;
};

type ContactMenuProps = {
  id: string;
  open: boolean;
  links: readonly MenuLink[];
  onClose: () => void;
};

export function ContactMenu({ id, open, links, onClose }: ContactMenuProps) {
  const pathname = usePathname();
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (cardRef.current?.contains(target)) return;
      const header = document.querySelector("[data-contact-header]");
      if (header?.contains(target)) return;
      onClose();
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open, onClose]);

  return (
    <div className={styles.menuRoot} aria-hidden={!open}>
      <nav
        ref={cardRef}
        id={id}
        className={`${styles.menuCard} ${open ? styles.menuCardOpen : ""}`}
        aria-label="Contact page navigation"
        inert={!open ? true : undefined}
      >
        <ul className={styles.menuList}>
          {links.map((link) => {
            const current = pathname === link.href;
            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className={`${styles.menuLink} ${
                    current ? styles.menuLinkCurrent : ""
                  }`}
                  aria-current={current ? "page" : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={onClose}
                >
                  <span className={styles.menuArrow} aria-hidden="true">
                    →
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
