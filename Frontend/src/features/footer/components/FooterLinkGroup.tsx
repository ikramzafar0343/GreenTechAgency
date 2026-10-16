import { Link } from "@/i18n/navigation";
import type { FooterLinkGroup as FooterLinkGroupData } from "@/features/footer/model/types";
import styles from "@/features/footer/styles/footerDirectory.module.css";

type FooterLinkGroupProps = {
  group: FooterLinkGroupData;
};

export function FooterLinkGroup({ group }: FooterLinkGroupProps) {
  return (
    <details
      className={styles.group}
      data-footer-group={group.id}
      data-default-open={group.defaultOpen ? "true" : "false"}
      open
    >
      <summary className={styles.groupSummary}>
        <span className={`${styles.groupTitle} typeHeading`}>{group.title}</span>
        <span className={styles.groupIcon} aria-hidden="true">
          <span className={styles.groupIconPlus}>+</span>
          <span className={styles.groupIconMinus}>−</span>
        </span>
      </summary>
      <ul className={styles.linkList}>
        {group.links.map((link) => (
          <li key={`${group.id}-${link.href}-${link.label}`}>
            <Link href={link.href} className={`${styles.navLink} typeNav`}>
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
