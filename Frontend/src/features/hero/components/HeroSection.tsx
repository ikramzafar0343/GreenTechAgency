import { getTranslations } from "next-intl/server";
import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { HeroActions } from "@/features/hero/components/HeroActions";
import { HeroMedia } from "@/features/hero/components/HeroMedia";
import { getPublicHero } from "@/features/hero/server/getPublicHero";
import styles from "@/features/hero/styles/hero.module.css";

export async function HeroSection() {
  const t = await getTranslations("home");
  const result = await getPublicHero();
  if (!result.ok) {
    if ("notPublished" in result) {
      return (
        <PublicFetchErrorPanel
          title={t("heroUnavailable")}
          message={t("heroNotPublished")}
        />
      );
    }
    return (
      <PublicFetchErrorPanel
        title={t("heroUnavailable")}
        message={result.error.message}
      />
    );
  }

  const content = result.data;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <HeroMedia media={content.media} />

      <div className={styles.content}>
        <h1 id="hero-heading" className={`${styles.headline} typeHero`}>
          {content.headline}
        </h1>

        <div className={styles.copy}>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.id} className={`${styles.paragraph} typeLead`}>
              {paragraph.before}
              {paragraph.emphasis}
              {paragraph.after}
            </p>
          ))}
        </div>

        <HeroActions
          primaryCta={content.primaryCta}
          secondaryCta={content.secondaryCta}
        />
      </div>
    </section>
  );
}
