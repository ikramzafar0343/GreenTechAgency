import type { FooterContactInfo } from "@/features/footer/model/types";
import styles from "@/features/footer/styles/footerDirectory.module.css";

type FooterContactProps = {
  contact: FooterContactInfo;
};

function toTelHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");
  return compact ? `tel:${compact}` : null;
}

export function FooterContact({ contact }: FooterContactProps) {
  const telHref = contact.phone ? toTelHref(contact.phone) : null;
  const hasDetails = Boolean(
    contact.address ||
      contact.email ||
      contact.phone ||
      contact.hours ||
      contact.mapUrl,
  );

  return (
    <div className={styles.contact}>
      <p className={`${styles.groupTitle} typeHeading`}>Contact us</p>
      {hasDetails ? (
        <address className={styles.address}>
          {contact.address ? (
            <p className={`${styles.contactLine} typeBody`}>{contact.address}</p>
          ) : null}
          {contact.mapUrl ? (
            <p className={`${styles.contactLine} typeBody`}>
              <a
                href={contact.mapUrl}
                className={styles.contactAnchor}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on map
              </a>
            </p>
          ) : null}
          {contact.email ? (
            <p className={`${styles.contactLine} typeBody`}>
              <a
                href={`mailto:${contact.email}`}
                className={styles.contactAnchor}
              >
                {contact.email}
              </a>
            </p>
          ) : null}
          {contact.phone && telHref ? (
            <p className={`${styles.contactLine} typeBody`}>
              <a href={telHref} className={styles.contactAnchor}>
                {contact.phone}
              </a>
            </p>
          ) : null}
          {contact.hours ? (
            <p className={`${styles.contactLine} typeBody`}>{contact.hours}</p>
          ) : null}
        </address>
      ) : (
        <p className={`${styles.contactFallback} typeBody`}>
          Prefer a quick conversation? Share your brief and we&apos;ll reply on
          business days.
        </p>
      )}
    </div>
  );
}
