import type { Metadata } from "next";
import { SubserviceDetailPage } from "@/features/services/components/SubserviceDetailPage";
import { getPublicSubserviceDetail } from "@/features/services/server/getPublicSubserviceDetail";
import { redirectOrNotFound } from "@/server/backend/redirectOrNotFound";

export const dynamic = "force-dynamic";

type SubservicePageProps = {
  params: Promise<{ serviceSlug: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: SubservicePageProps): Promise<Metadata> {
  const { serviceSlug, slug } = await params;
  const detail = await getPublicSubserviceDetail(serviceSlug, slug);
  if (!detail) {
    return { title: "Service" };
  }
  return {
    title: `${detail.title} | GreenTech Agency`,
    description: detail.summary,
  };
}

export default async function SubserviceRoutePage({ params }: SubservicePageProps) {
  const { serviceSlug, slug } = await params;
  const detail = await getPublicSubserviceDetail(serviceSlug, slug);
  if (!detail) {
    await redirectOrNotFound(`/services/${serviceSlug}/${slug}`);
    throw new Error("Unreachable after redirectOrNotFound");
  }

  return <SubserviceDetailPage detail={detail} />;
}
