import { parseListItem } from "@/shared/lib/richListItem";

type BlogArticleAsideProps = {
  readonly facts: readonly string[];
  readonly toc: readonly { id: string; text: string }[];
};

/** Wikipedia-style infobox ("Key facts") and table of contents. */
export function BlogArticleAside({ facts, toc }: BlogArticleAsideProps) {
  if (facts.length === 0 && toc.length === 0) {
    return null;
  }
  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
      {facts.length > 0 ? (
        <section
          aria-labelledby="key-facts-heading"
          className="rounded-2xl border border-white/12 bg-white/[0.04] p-6"
        >
          <h2 id="key-facts-heading" className="typeMeta tracking-[0.14em] text-[var(--nav-muted)] uppercase">
            Key facts
          </h2>
          <dl className="mt-4 space-y-3">
            {facts.map((raw) => {
              const { label } = parseListItem(raw);
              const [term, ...rest] = label.split(":");
              const value = rest.join(":").trim();
              return (
                <div key={raw} className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
                  {value ? (
                    <>
                      <dt className="typeSmall text-[var(--nav-muted)]">{term}</dt>
                      <dd className="typeSmall mt-1 text-white">{value}</dd>
                    </>
                  ) : (
                    <dt className="typeSmall text-white">{label}</dt>
                  )}
                </div>
              );
            })}
          </dl>
        </section>
      ) : null}
      {toc.length > 0 ? (
        <nav aria-label="Contents" className="rounded-2xl border border-white/12 p-6">
          <p className="typeMeta tracking-[0.14em] text-[var(--nav-muted)] uppercase">Contents</p>
          <ol className="mt-4 space-y-2">
            {toc.map((entry, index) => (
              <li key={entry.id} className="typeSmall flex gap-3">
                <span className="text-[var(--nav-muted)] tabular-nums">{index + 1}</span>
                <a href={`#${entry.id}`} className="text-white/85 underline-offset-4 hover:text-white hover:underline">
                  {entry.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </aside>
  );
}
