import { SplitReveal } from "@/shared/motion/SplitReveal";

export type LegalSection = {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
};

type LegalDocumentProps = {
  readonly title: string;
  readonly updated: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
};

/** Shared layout for the privacy policy and terms pages. */
export function LegalDocument({ title, updated, intro, sections }: LegalDocumentProps) {
  return (
    <main className="relative flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-3xl px-[clamp(1.25rem,3.5vw,3rem)] py-[clamp(4rem,10vw,7rem)]">
        <SplitReveal as="h1" className="typeDisplay mb-4">
          {title}
        </SplitReveal>
        <p className="typeMeta opacity-70">Last updated: {updated}</p>
        <p className="typeLead mt-8 opacity-90">{intro}</p>
        <nav aria-label="On this page" className="mt-10 rounded-2xl border border-current/15 p-6">
          <p className="typeMeta tracking-[0.14em] uppercase opacity-70">On this page</p>
          <ol className="typeSmall mt-3 list-decimal space-y-1 pl-5">
            {sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#section-${index + 1}`} className="underline-offset-4 hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="typeProse mt-12 opacity-90">
          {sections.map((section, index) => (
            <section key={section.heading} aria-labelledby={`section-${index + 1}`}>
              <h2 id={`section-${index + 1}`} className="scroll-mt-28">
                {index + 1}. {section.heading}
              </h2>
              {section.paragraphs?.map((text) => <p key={text}>{text}</p>)}
              {section.items ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
