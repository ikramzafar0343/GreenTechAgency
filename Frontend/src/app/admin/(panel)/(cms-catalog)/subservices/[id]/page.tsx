import { SubserviceEditor } from "@/features/cmsAdmin/SubserviceEditor";

type AdminSubserviceEditorRouteProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function AdminSubserviceEditorRoute({
  params,
}: AdminSubserviceEditorRouteProps) {
  const { id } = await params;
  return <SubserviceEditor id={id} />;
}
