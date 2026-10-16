import type { Metadata } from "next";
import { PublicFetchErrorPanel } from "@/components/site/PublicFetchErrorPanel";
import { AboutPage } from "@/features/about/components/AboutPage";
import { getPublicAboutPage } from "@/features/about/server/getPublicAboutPage";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getPublicAboutPage();
  if (!result.ok) {
    return {
      title: "About | GreenTech Agency",
      description: "Learn about GreenTech Agency.",
    };
  }
  return {
    title: result.content.seo.title,
    description: result.content.seo.description,
    alternates: {
      canonical: result.content.seo.canonicalPath,
    },
  };
}

export default async function AboutRoutePage() {
  const result = await getPublicAboutPage();
  if (!result.ok) {
    if ("notPublished" in result) {
      return (
        <main className="relative flex flex-1 flex-col">
          <PublicFetchErrorPanel
            title="About page not available"
            message="This content is not published yet."
          />
        </main>
      );
    }
    return (
      <main className="relative flex flex-1 flex-col">
        <PublicFetchErrorPanel
          title="About page unavailable"
          message={result.error.message}
        />
      </main>
    );
  }
  return <AboutPage content={result.content} />;
}
