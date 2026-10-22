import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { BlogArticleBody } from "@/features/blog/components/BlogArticleBody";
import { getBlogArticle } from "@/features/blog/server/getBlogArticle";
import { formatInsightDate } from "@/features/insights/lib/formatInsightDate";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { redirectOrNotFound } from "@/server/backend/redirectOrNotFound";

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
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url: absoluteUrl(path),
      type: "article",
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

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-28 sm:px-8">
      <JsonLdScript
        data={[
          articleJsonLd({
            headline: article.title,
            description: article.seoDescription,
            path,
            datePublished: article.publishedAt,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path },
          ]),
        ]}
      />
      <p className="typeMeta text-[var(--nav-muted)]">{article.category}</p>
      <h1 className="typeHero mt-4 text-white">{article.title}</h1>
      <p className="typeMeta mt-4 text-[var(--nav-muted)]">
        {dateLabel}
        {dateLabel && article.readTimeMinutes ? " · " : null}
        {article.readTimeMinutes ? `${article.readTimeMinutes} min read` : null}
      </p>
      <p className="typeLead measureLead mt-8 text-[var(--nav-muted)]">
        {article.excerpt}
      </p>
      <BlogArticleBody articleId={article.id} blocks={article.bodyBlocks} />
      <div className="mt-12">
        <Link
          href="/insights"
          className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
        >
          Back to Insights
        </Link>
      </div>
    </main>
  );
}
