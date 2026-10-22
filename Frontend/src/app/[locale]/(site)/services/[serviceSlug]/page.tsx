import type { Metadata } from "next";
import { ServiceDetailPage } from "@/features/services/components/ServiceDetailPage";
import { getPublicServiceDetail } from "@/features/services/server/getPublicServiceDetail";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/jsonLd";
import { JsonLdScript } from "@/lib/seo/JsonLdScript";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { redirectOrNotFound } from "@/server/backend/redirectOrNotFound";

export const dynamic = "force-dynamic";

type ServicePageProps = {
  params: Promise<{ serviceSlug: string }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const detail = await getPublicServiceDetail(serviceSlug);
  if (!detail) {
    return { title: "Service" };
  }
  const path = `/services/${detail.slug}`;
  return {
    title: detail.title,
    description: detail.summary,
    alternates: { canonical: path },
    openGraph: {
      title: `${detail.title} | GreenTech Agency`,
      description: detail.summary,
      url: absoluteUrl(path),
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const detail = await getPublicServiceDetail(serviceSlug);
  if (!detail) {
    await redirectOrNotFound(`/services/${serviceSlug}`);
    throw new Error("Unreachable after redirectOrNotFound");
  }

  const path = `/services/${detail.slug}`;

  return (
    <main>
      <JsonLdScript
        data={[
          serviceJsonLd({
            name: detail.title,
            description: detail.summary,
            path,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: detail.title, path },
          ]),
        ]}
      />
      <ServiceDetailPage detail={detail} />
    </main>
  );
}
