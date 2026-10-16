import { StatsEditor } from "@/features/cmsAdmin/StatsEditor";

type AdminStatsEditorRouteProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function AdminStatsEditorRoute({
  params,
}: AdminStatsEditorRouteProps) {
  const { id } = await params;
  return <StatsEditor id={id} />;
}
