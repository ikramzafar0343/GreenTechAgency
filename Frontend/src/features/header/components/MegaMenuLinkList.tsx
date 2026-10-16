"use client";

import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { HiChevronRight } from "react-icons/hi2";
import { navigateFromMenu } from "@/features/header/utils/navigateFromMenu";
import type { MegaMenuLink } from "@/features/navigation/model/megaMenuContent";
import styles from "@/features/header/styles/megaMenu.module.css";

type MegaMenuLinkListProps = {
  links: readonly MegaMenuLink[];
  interactive: boolean;
  onNavigate: () => void;
};

export function MegaMenuLinkList({
  links,
  interactive,
  onNavigate,
}: MegaMenuLinkListProps) {
  const router = useRouter();

  return (
    <ul className={styles.linkList}>
      {links.map((link) => (
        <li key={link.id} className={styles.linkRow}>
          <Link
            href={link.href}
            className={`${styles.link} typeNav`}
            tabIndex={interactive ? 0 : -1}
            onClick={(event) =>
              navigateFromMenu(event, link.href, router, onNavigate)
            }
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.linkLabel}>{link.label}</span>
            <HiChevronRight aria-hidden="true" className={styles.chevron} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
