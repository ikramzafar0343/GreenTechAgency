import type { Metadata } from "next";
import { PortfolioPageView } from "@/features/portfolio/components/portfolioPage/PortfolioPageView";
import { getPublicPortfolioPage } from "@/features/portfolio/server/getPublicPortfolioPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPublicPortfolioPage();
  return {
    title: content.settings.seo.title,
    description: content.settings.seo.description,
    alternates: {
      canonical: content.settings.seo.canonicalPath,
    },
    openGraph: {
      title: content.settings.seo.title,
      description: content.settings.seo.description,
      url: content.settings.seo.canonicalPath,
    },
  };
}

export default async function PortfolioRoutePage() {
  const content = await getPublicPortfolioPage();
  return <PortfolioPageView data={content} />;
}
