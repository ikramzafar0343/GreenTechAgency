import Image from "next/image";
import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { SectionIntro } from "@/components/site/SectionIntro";
import { getPublicWhyChoose } from "@/features/why-choose-us/server/getPublicWhyChoose";
import styles from "@/features/why-choose-us/styles/whyChoose.module.css";

export async function WhyChooseUsSection() {
  const result = await getPublicWhyChoose();
  if (!result.ok) {
    if ("notPublished" in result) {
      return null;
    }
    return (
      <PublicFetchErrorPanel
        title="Why choose us unavailable"
        message={result.error.message}
      />
    );
  }

  const { intro, cards, media } = result.data;
  const { largeImage, smallImage } = media;
  const eyebrow = intro.eyebrow ?? "Why Choose Us";
  const heading =
    intro.heading?.trim() ||
    intro.support?.trim() ||
    "Principles that guide how we partner, design, and ship digital work that lasts.";
  const supporting =
    intro.heading?.trim() && intro.support?.trim() ? intro.support : null;

  return (
    <section className={styles.section} aria-labelledby="why-choose-heading">
      <div className={styles.container}>
        <SectionIntro
          headingId="why-choose-heading"
          eyebrow={eyebrow}
          heading={heading}
          supporting={supporting}
          tone="light"
          align="center"
          className={styles.header}
        />

        <ol className={styles.principles}>
          {cards.map((card) => (
            <li key={card.id} className={styles.principle}>
              <p className={`${styles.number} typeMetric`} aria-hidden="true">
                {card.number}
              </p>
              <h3 className={`${styles.title} typeCardTitle`}>{card.title}</h3>
              <p className={`${styles.copy} typeBody`}>{card.copy}</p>
            </li>
          ))}
        </ol>

        <div className={styles.mediaDuo}>
          <figure className={styles.large}>
            <Image
              src={largeImage.src}
              alt={largeImage.alt}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className={styles.largeImage}
              priority={false}
            />
          </figure>

          <div className={styles.smallWrap}>
            <figure className={styles.small}>
              <Image
                src={smallImage.src}
                alt={smallImage.alt}
                fill
                sizes="(max-width: 767px) 80vw, 28vw"
                className={styles.smallImage}
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
