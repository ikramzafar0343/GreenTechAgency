import type { Metadata } from "next";
import { ServiceDetailPage } from "@/features/services/components/ServiceDetailPage";
import { getPublicServiceDetail } from "@/features/services/server/getPublicServiceDetail";
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
  return {
    title: `${detail.title} | GreenTech Agency`,
    description: detail.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { serviceSlug } = await params;
  const detail = await getPublicServiceDetail(serviceSlug);
  if (!detail) {
    await redirectOrNotFound(`/services/${serviceSlug}`);
    throw new Error("Unreachable after redirectOrNotFound");
  }

  return (
    <main>
      <ServiceDetailPage detail={detail} />
    </main>
  );
}
