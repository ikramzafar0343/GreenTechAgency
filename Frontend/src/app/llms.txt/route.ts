import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { backendPublicGet } from "@/server/backend/client";
import type { BackendBlogListItem, BackendListResponse } from "@/server/backend/dtos";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";

export const dynamic = "force-dynamic";

/**
 * /llms.txt (https://llmstxt.org/): a plain-markdown map of the site for AI assistants,
 * so generative engines can find authoritative pages about GreenTech (GEO).
 */
export async function GET(): Promise<Response> {
  const [services, posts] = await Promise.all([
    fetchPublishedServices().catch(() => []),
    backendPublicGet<BackendListResponse<BackendBlogListItem> | BackendBlogListItem[]>("/api/blog")
      .then(parseItemsResponse)
      .catch(() => [] as BackendBlogListItem[]),
  ]);

  const lines = [
    "# GreenTech Agency",
    "",
    "> GreenTech Agency is a digital agency and software house that designs, builds and grows websites, mobile apps, ecommerce stores and digital products, with services in UI/UX, SEO, generative engine optimization (GEO), AI, AR/VR, branding, animation and IT resource outsourcing.",
    "",
    "## Company",
    `- [About GreenTech](${absoluteUrl("/about")}): who we are, how we work and selected work`,
    `- [Services](${absoluteUrl("/services")}): all services in one overview`,
    `- [Portfolio](${absoluteUrl("/portfolio")}): case studies and delivered projects`,
    `- [Contact](${absoluteUrl("/contact")}): start a project or ask a question`,
    "",
    "## Services",
    ...services.map((item) => `- [${item.title}](${absoluteUrl(`/services/${item.slug}`)}): ${item.summary}`),
    "",
    "## Guides and insights",
    ...posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${post.excerpt}`),
    "",
    "## Optional",
    `- [Privacy policy](${absoluteUrl("/privacy")})`,
    `- [Terms](${absoluteUrl("/terms")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
