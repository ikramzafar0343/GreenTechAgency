import { ContactEntryOverlay } from "@/features/contact/components/ContactEntryOverlay";
import { ContactFlow } from "@/features/contact/components/ContactFlow";
import { ContactHero } from "@/features/contact/components/ContactHero";
import type { ContactServiceChip } from "@/features/services/server/getContactServiceCatalog";
import styles from "@/features/contact/styles/contactPage.module.css";

type ContactPageViewProps = {
  serviceChips: readonly ContactServiceChip[];
};

export function ContactPageView({ serviceChips }: ContactPageViewProps) {
  return (
    <div
      className={styles.page}
      data-contact-page
      data-header-surface="light"
    >
      <ContactEntryOverlay />
      <ContactHero />
      <div className={styles.main}>
        <ContactFlow serviceChips={serviceChips} />
      </div>
    </div>
  );
}
