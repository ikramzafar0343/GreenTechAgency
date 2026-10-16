import type { Metadata } from "next";
import { InsightsPageView } from "@/features/insights/components/insightsPage/InsightsPageView";
import { getPublicInsightsPage } from "@/features/insights/server/getPublicInsightsPage";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://greentech.agency";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicInsightsPage();
  return {
    title: content.settings.seo.title,
    description: content.settings.seo.description,
    alternates: {
      canonical: content.settings.seo.canonicalPath,
    },
  };
}

export default async function InsightsRoutePage() {
  const content = await getPublicInsightsPage();
  const itemList = content.articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}${article.href}`,
    name: article.title,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.settings.seo.title,
    description: content.settings.seo.description,
    url: `${SITE_URL}${content.settings.seo.canonicalPath}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemList,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InsightsPageView data={content} />
    </>
  );
}
