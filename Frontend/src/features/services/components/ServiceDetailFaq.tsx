import { Link } from "@/i18n/navigation";
import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import styles from "@/features/services/styles/serviceDetailEditorial.module.css";
import { Reveal } from "@/shared/motion/Reveal";

type Props = {
  detail: PublicServiceDetail;
};

/** Direct answers to common buyer questions (also emitted as FAQPage JSON-LD by the route). */
export function ServiceDetailFaq({ detail }: Props) {
  if (detail.faqs.length === 0) {
    return null;
  }
  return (
    <section
      className={`${styles.section} ${styles.editorial} ${styles.reveal}`}
      aria-labelledby="service-faq"
    >
      <h2 id="service-faq" className={`${styles.principlesHead} typeSectionTitle`}>
        {detail.title}: questions we hear most
      </h2>
      <div className="mt-8 divide-y divide-[var(--ed-line)] border-y border-[var(--ed-line)]">
        {detail.faqs.map((faq, index) => (
          <Reveal key={faq.id} delay={index * 0.06}>
          <details className="group py-5">
            <summary className="typeHeading flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 text-[var(--ed-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ed-accent)]">
              {faq.question}
              <span
                aria-hidden="true"
                className="text-2xl leading-none text-[var(--ed-accent)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="typeBody mt-3 max-w-3xl text-[var(--ed-muted)]">{faq.answer}</p>
          </details>
          </Reveal>
        ))}
      </div>
      <p className="typeBody mt-8 text-[var(--ed-muted)]">
        Want the full picture?{" "}
        <Link
          href={`/blog/${detail.slug}-guide`}
          className="text-[var(--ed-accent)] underline underline-offset-4"
        >
          Read our complete {detail.title} guide
        </Link>
        .
      </p>
    </section>
  );
}
