import { PortfolioEditor } from "@/features/cmsAdmin/PortfolioEditor";

type AdminPortfolioEditorRouteProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function AdminPortfolioEditorRoute({
  params,
}: AdminPortfolioEditorRouteProps) {
  const { id } = await params;
  return <PortfolioEditor id={id} />;
}
