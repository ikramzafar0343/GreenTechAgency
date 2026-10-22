import type { Metadata } from "next";
import { InsightsPageView } from "@/features/insights/components/insightsPage/InsightsPageView";
import { getPublicInsightsPage } from "@/features/insights/server/getPublicInsightsPage";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicInsightsPage();
  const path = content.settings.seo.canonicalPath || "/insights";
  return {
    title: content.settings.seo.title,
    description: content.settings.seo.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: content.settings.seo.title,
      description: content.settings.seo.description,
      url: absoluteUrl(path),
    },
  };
}

export default async function InsightsRoutePage() {
  const content = await getPublicInsightsPage();
  const siteUrl = getSiteUrl();
  const itemList = content.articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${siteUrl}${article.href}`,
    name: article.title,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.settings.seo.title,
    description: content.settings.seo.description,
    url: absoluteUrl(content.settings.seo.canonicalPath || "/insights"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: itemList,
    },
  };

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <InsightsPageView data={content} />
    </>
  );
}
