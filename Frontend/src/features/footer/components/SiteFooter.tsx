import { getTranslations } from "next-intl/server";
import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { AstronautCtaSection } from "@/features/cta/components/AstronautCtaSection";
import { ClosingCtaGate } from "@/features/footer/components/ClosingCtaGate";
import { FooterContact } from "@/features/footer/components/FooterContact";
import { FooterLinkGroup } from "@/features/footer/components/FooterLinkGroup";
import { FooterMobileDefaults } from "@/features/footer/components/FooterMobileDefaults";
import { FooterSocialLinks } from "@/features/footer/components/FooterSocialLinks";
import { buildFooterLinkGroups } from "@/features/footer/model/footerLinkGroups";
import { getPublicCta } from "@/features/cta/server/getPublicCta";
import { getPublicFooter } from "@/features/footer/server/getPublicFooter";
import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { Link } from "@/i18n/navigation";
import styles from "@/features/footer/styles/footer.module.css";
import directoryStyles from "@/features/footer/styles/footerDirectory.module.css";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tErrors = await getTranslations("errors");
  const [footerResult, ctaResult, services] = await Promise.all([
    getPublicFooter(),
    getPublicCta(),
    fetchPublishedServices().catch(() => []),
  ]);
  if (!footerResult.ok) {
    return (
      <PublicFetchErrorPanel
        title={tErrors("footerUnavailable")}
        message={footerResult.error.message}
      />
    );
  }
  const settings = footerResult.settings;
  const linkGroups = buildFooterLinkGroups(
    settings.groupTitles,
    services.map((row) => ({ slug: row.slug, title: row.title })),
  );
  const legalLinks = [
    settings.privacyHref
      ? { href: settings.privacyHref, label: t("privacy") }
      : null,
    settings.termsHref
      ? { href: settings.termsHref, label: t("terms") }
      : null,
  ].filter((link): link is { href: string; label: string } => link !== null);

  const hasSocial = settings.socialLinks.length > 0;
  const watermarkWord =
    settings.copyrightName.split(/\s+/)[0]?.toUpperCase() || "GREENTECH";
  const brandParts = settings.brandName.trim().split(/\s+/).filter(Boolean);
  const brandPrimary =
    brandParts.length > 1
      ? brandParts.slice(0, -1).join(" ")
      : (brandParts[0] ?? settings.brandName);
  const brandSecondary =
    brandParts.length > 1 ? (brandParts[brandParts.length - 1] ?? null) : null;

  return (
    <div data-site-closing>
      <ClosingCtaGate>
        {ctaResult.ok ? (
          <AstronautCtaSection content={ctaResult.data} />
        ) : "notPublished" in ctaResult ? null : (
          <PublicFetchErrorPanel
            title={tErrors("ctaUnavailable")}
            message={ctaResult.error.message}
          />
        )}
      </ClosingCtaGate>
      <footer className={styles.footer} data-site-footer>
        <FooterMobileDefaults />
        <div className={styles.container}>
          <div className={styles.brandSocial}>
            <Link
              href="/"
              className={styles.textLogo}
              aria-label={settings.brandName}
              data-no-translate
            >
              <span className={styles.textLogoMark}>{brandPrimary}</span>
              {brandSecondary ? (
                <span className={styles.textLogoEyebrow}>{brandSecondary}</span>
              ) : null}
            </Link>

            {hasSocial ? (
              <div className={styles.socialBand}>
                <span className={styles.socialRule} aria-hidden="true" />
                <FooterSocialLinks links={settings.socialLinks} />
                <span className={styles.socialRule} aria-hidden="true" />
              </div>
            ) : null}
          </div>

          <div className={styles.directoryStage}>
            {settings.showBrandSignature ? (
              <div className={styles.watermarkWrap} aria-hidden="true">
                <div className={styles.watermarkGlow} />
                <p className={styles.watermark}>{watermarkWord}</p>
              </div>
            ) : null}

            <div className={styles.directoryContent}>
              <div className={directoryStyles.directory}>
                <FooterContact contact={settings.contact} />
                {linkGroups.map((group) => (
                  <FooterLinkGroup key={group.id} group={group} />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rule} aria-hidden="true" />

          <div className={styles.legalRow}>
            {legalLinks.length > 0 ? (
              <ul className={styles.legalLinks}>
                {legalLinks.map((link, index) => (
                  <li key={link.href} className={styles.legalItem}>
                    {index > 0 ? (
                      <span className={styles.legalSep} aria-hidden="true">
                        |
                      </span>
                    ) : null}
                    <Link
                      href={link.href}
                      className={`${styles.legalLink} typeSmall`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <span className={styles.legalSpacer} />
            )}
            <p className={`${styles.copy} typeSmall`}>
              © {settings.year}. {settings.copyrightName}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
