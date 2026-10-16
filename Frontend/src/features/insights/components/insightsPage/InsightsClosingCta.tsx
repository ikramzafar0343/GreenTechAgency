import { Link } from "@/i18n/navigation";
import styles from "@/features/insights/styles/insightsPage.module.css";

type InsightsClosingCtaProps = {
  heading: string;
  label: string;
  href: string;
};

export function InsightsClosingCta({
  heading,
  label,
  href,
}: InsightsClosingCtaProps) {
  return (
    <section className={styles.closing} aria-label="Contact">
      <p className={`${styles.closingHeading} typeHeading`}>{heading}</p>
      <Link href={href} className={`${styles.closingLink} typeButton`}>
        {label}
      </Link>
    </section>
  );
}
