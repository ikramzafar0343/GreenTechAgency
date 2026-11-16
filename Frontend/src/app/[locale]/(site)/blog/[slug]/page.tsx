import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BlogArticleAside } from "@/features/blog/components/BlogArticleAside";
import { BlogArticleBody } from "@/features/blog/components/BlogArticleBody";
import { splitArticleBlocks } from "@/features/blog/lib/splitArticleBlocks";
import { getBlogArticle } from "@/features/blog/server/getBlogArticle";
import { formatInsightDate } from "@/features/insights/lib/formatInsightDate";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { redirectOrNotFound } from "@/server/backend/redirectOrNotFound";
import { Magnetic } from "@/shared/motion/Magnetic";
import { Reveal } from "@/shared/motion/Reveal";
import { SplitReveal } from "@/shared/motion/SplitReveal";
import { SpotlightCard } from "@/shared/motion/SpotlightCard";

export const dynamic = "force-dynamic";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) {
    return { title: "Insight" };
  }
  const path = `/blog/${article.slug}`;
  const images = article.coverUrl ? [{ url: absoluteUrl(article.coverUrl), alt: article.coverAlt }] : undefined;
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url: absoluteUrl(path),
      type: "article",
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(images ? { images } : {}),
    },
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) {
    await redirectOrNotFound(`/blog/${slug}`);
    throw new Error("Unreachable after redirectOrNotFound");
  }

  const dateLabel = formatInsightDate(article.publishedAt);
  const path = `/blog/${article.slug}`;
  const outline = splitArticleBlocks(article.bodyBlocks);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pt-28 pb-24 sm:px-8">
      <JsonLdScript
        data={[
          articleJsonLd({
            headline: article.title,
            description: article.seoDescription,
            path,
            datePublished: article.publishedAt,
            image: article.coverUrl,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="typeMeta text-[var(--nav-muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-white">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/insights" className="hover:text-white">Insights</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-white/80">{article.category}</li>
        </ol>
      </nav>

      <header className="mt-8 max-w-3xl">
        <p className="typeMeta tracking-[0.14em] text-[var(--nav-muted)] uppercase">{article.category}</p>
        <SplitReveal as="h1" className="typeHero mt-4 text-white">
          {article.title}
        </SplitReveal>
        <p className="typeMeta mt-5 text-[var(--nav-muted)]">
          GreenTech Agency
          {dateLabel ? ` · ${dateLabel}` : null}
          {article.readTimeMinutes ? ` · ${article.readTimeMinutes} min read` : null}
        </p>
      </header>

      {article.coverUrl ? (
        <Reveal>
        <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <Image
            src={article.coverUrl}
            alt={article.coverAlt}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
        </Reveal>
      ) : null}

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <p className="typeLead measureLead text-white/90">{article.excerpt}</p>
          <BlogArticleBody articleId={article.id} blocks={outline.body} />
        </article>
        <BlogArticleAside facts={outline.facts} toc={outline.toc} />
      </div>

      <SpotlightCard className="mt-20 rounded-3xl border border-white/12 bg-white/[0.04]">
      <section className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="max-w-xl">
          <h2 className="typeHeading text-white">Planning something similar?</h2>
          <p className="typeBody mt-3 text-[var(--nav-muted)]">
            Tell GreenTech what you are building and we will reply with a clear next step.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Link href="/contact" className="typeButton inline-flex min-h-11 items-center rounded-full bg-white px-6 py-3 text-black">
              Start a conversation
            </Link>
          </Magnetic>
          <Link href="/insights" className="typeButton inline-flex min-h-11 items-center rounded-full border border-white/30 px-6 py-3 text-white">
            More insights
          </Link>
        </div>
      </section>
      </SpotlightCard>
    </main>
  );
}
