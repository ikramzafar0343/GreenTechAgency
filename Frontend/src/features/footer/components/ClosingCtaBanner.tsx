import { ClosingCtaArrow } from "@/features/footer/components/ClosingCtaArrow";
import { ClosingCtaMotion } from "@/features/footer/components/ClosingCtaMotion";
import type { PublicFooterSettings } from "@/features/footer/model/types";
import styles from "@/features/footer/styles/closingCta.module.css";
import { CreamCtaButton } from "@/shared/ui/CreamCtaButton";

type ClosingCtaBannerProps = {
  settings: PublicFooterSettings;
};

export function ClosingCtaBanner({ settings }: ClosingCtaBannerProps) {
  const hasAction =
    Boolean(settings.ctaHref?.trim()) && Boolean(settings.ctaLabel?.trim());

  if (!settings.showClosingCta || !hasAction) {
    return null;
  }

  return (
    <section
      className={styles.section}
      aria-labelledby="closing-cta-heading"
      data-closing-cta
    >
      <ClosingCtaMotion
        enabled={settings.ctaEntryAnimation}
        drawArrow={settings.showCtaArrow}
      />
      <div className={styles.container}>
        <div className={styles.panel} data-closing-cta-panel>
          <div className={styles.copy}>
            <h2 id="closing-cta-heading" className={`${styles.heading} typeSectionTitle`}>
              {settings.ctaHeading}
            </h2>
            <p className={`${styles.body} typeLead`}>{settings.ctaBody}</p>
          </div>

          <div className={styles.action}>
            {settings.showCtaArrow ? (
              <div className={styles.arrowWrap} aria-hidden="true">
                <ClosingCtaArrow />
              </div>
            ) : null}
            <CreamCtaButton href={settings.ctaHref}>
              {settings.ctaLabel}
            </CreamCtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
