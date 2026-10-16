import { TestimonialsEditor } from "@/features/cmsAdmin/TestimonialsEditor";

type AdminTestimonialEditorRouteProps = {
  readonly params: Promise<{ readonly id: string }>;
};

export default async function AdminTestimonialEditorRoute({
  params,
}: AdminTestimonialEditorRouteProps) {
  const { id } = await params;
  return <TestimonialsEditor id={id} />;
}
