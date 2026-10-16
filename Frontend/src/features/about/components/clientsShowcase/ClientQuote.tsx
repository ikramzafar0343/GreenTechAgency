import type { AboutClientsSectionContent } from "@/features/about/model/aboutPageTypes";
import styles from "@/features/about/components/clientsShowcase/clientsShowcase.module.css";

type ClientQuoteProps = {
  content: Pick<
    AboutClientsSectionContent,
    "descriptor" | "quote" | "quoteAuthor"
  >;
};

export function ClientQuote({ content }: ClientQuoteProps) {
  const hasQuote = Boolean(content.quote && content.quoteAuthor);

  return (
    <aside className={styles.quote} data-client-quote>
      {hasQuote ? (
        <blockquote className={styles.quoteBody}>
          <p className={styles.quoteText}>{content.quote}</p>
          <cite className={styles.quoteCite}>{content.quoteAuthor}</cite>
        </blockquote>
      ) : (
        <div className={styles.quoteBody}>
          <p className={styles.quoteText}>{content.descriptor}</p>
        </div>
      )}
    </aside>
  );
}
