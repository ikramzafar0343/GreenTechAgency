import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getPublicPortfolioBySlug } from "@/features/portfolio/server/getPublicPortfolioBySlug";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { redirectOrNotFound } from "@/server/backend/redirectOrNotFound";

export const dynamic = "force-dynamic";

type PortfolioCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PortfolioCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicPortfolioBySlug(slug);
  if (!project) {
    return { title: "Case Study" };
  }
  const path = `/portfolio/${project.slug}`;
  return {
    title: `${project.seoTitle} | GreenTech Agency`,
    description: project.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      title: project.seoTitle,
      description: project.seoDescription,
      url: absoluteUrl(path),
      type: "article",
      images: project.coverUrl ? [{ url: project.coverUrl }] : undefined,
    },
  };
}

export default async function PortfolioCaseStudyPage({
  params,
}: PortfolioCaseStudyPageProps) {
  const { slug } = await params;
  const project = await getPublicPortfolioBySlug(slug);
  if (!project) {
    await redirectOrNotFound(`/portfolio/${slug}`);
    throw new Error("Unreachable after redirectOrNotFound");
  }

  const path = `/portfolio/${project.slug}`;
  const bodyBlocks =
    project.caseStudyBlocks.length > 0
      ? project.caseStudyBlocks
      : project.description
        ? ([{ type: "paragraph" as const, text: project.description }] as const)
        : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-28 sm:px-8">
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: project.title, path },
          ]),
          articleJsonLd({
            headline: project.title,
            description: project.seoDescription,
            path,
            image: project.coverUrl,
          }),
        ]}
      />
      <p className="typeMeta text-[var(--nav-muted)]">{project.category}</p>
      <h1 className="typeHero mt-4 text-white">{project.title}</h1>
      {project.clientName ? (
        <p className="typeMeta mt-4 text-[var(--nav-muted)]">
          Client: {project.clientName}
        </p>
      ) : null}
      {project.summary ? (
        <p className="typeLead measureLead mt-8 text-[var(--nav-muted)]">
          {project.summary}
        </p>
      ) : null}
      {project.coverUrl ? (
        <div className="relative mt-10 aspect-[16/10] w-full overflow-hidden rounded-lg bg-white/5">
          <Image
            src={project.coverUrl}
            alt={project.coverAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized={
              project.coverUrl.startsWith("/media/") ||
              project.coverUrl.startsWith("http")
            }
          />
        </div>
      ) : null}
      <div className="mt-10 space-y-5">
        {bodyBlocks.map((block, index) =>
          block.type === "heading" ? (
            block.level === 3 ? (
              <h3 key={index} className="typeHeading text-white">
                {block.text}
              </h3>
            ) : (
              <h2 key={index} className="typeHeading text-white">
                {block.text}
              </h2>
            )
          ) : (
            <p key={index} className="typeBody text-[var(--nav-muted)]">
              {block.text}
            </p>
          ),
        )}
      </div>
      {project.relatedServiceSlug ? (
        <p className="mt-10">
          <Link
            href={`/services/${project.relatedServiceSlug}`}
            className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
          >
            Related service
          </Link>
        </p>
      ) : null}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/portfolio"
          className="typeButton inline-flex items-center rounded-full border border-white/30 px-5 py-3 text-white"
        >
          Back to Portfolio
        </Link>
        <Link
          href="/contact"
          className="typeButton inline-flex items-center rounded-full bg-white px-5 py-3 text-black"
        >
          Start a similar project
        </Link>
      </div>
    </main>
  );
}
