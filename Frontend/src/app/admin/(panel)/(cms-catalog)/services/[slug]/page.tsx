import { ServiceEditor } from "@/features/cmsAdmin/ServiceEditor";

type AdminServiceEditorRouteProps = {
  readonly params: Promise<{ readonly slug: string }>;
};

export default async function AdminServiceEditorRoute({
  params,
}: AdminServiceEditorRouteProps) {
  const { slug } = await params;
  return <ServiceEditor slug={slug} />;
}
