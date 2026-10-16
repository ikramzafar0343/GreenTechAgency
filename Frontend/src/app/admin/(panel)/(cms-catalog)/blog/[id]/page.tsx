import { BlogEditor } from "@/features/cmsAdmin/BlogEditor";

type AdminBlogEditorRouteProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function AdminBlogEditorRoute({
  params,
}: AdminBlogEditorRouteProps) {
  const { id } = await params;
  return <BlogEditor id={id} />;
}
