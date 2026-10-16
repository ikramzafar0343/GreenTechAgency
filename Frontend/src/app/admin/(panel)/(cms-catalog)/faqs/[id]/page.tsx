import { FaqEditor } from "@/features/cmsAdmin/FaqEditor";

type AdminFaqEditorRouteProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function AdminFaqEditorRoute({
  params,
}: AdminFaqEditorRouteProps) {
  const { id } = await params;
  return <FaqEditor id={id} />;
}
