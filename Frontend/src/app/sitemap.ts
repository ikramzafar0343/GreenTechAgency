import type { MetadataRoute } from "next";
import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { absoluteUrl } from "@/lib/seo/siteUrl";
import { backendPublicGet } from "@/server/backend/client";
import type {
  BackendBlogListItem,
  BackendListResponse,
  BackendPortfolioListItem,
} from "@/server/backend/dtos";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    "/",
    "/about",
    "/services",
    "/portfolio",
    "/insights",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const [services, blog, portfolio] = await Promise.all([
    fetchPublishedServices().catch(() => []),
    backendPublicGet<BackendListResponse<BackendBlogListItem> | BackendBlogListItem[]>(
      "/api/blog",
    )
      .then(parseItemsResponse)
      .catch(() => [] as BackendBlogListItem[]),
    backendPublicGet<
      BackendListResponse<BackendPortfolioListItem> | BackendPortfolioListItem[]
    >("/api/portfolio")
      .then(parseItemsResponse)
      .catch(() => [] as BackendPortfolioListItem[]),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...services.map((item) => ({
      url: absoluteUrl(`/services/${item.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blog.map((item) => ({
      url: absoluteUrl(`/blog/${item.slug}`),
      lastModified: item.publishedAt ? new Date(item.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...portfolio.map((item) => ({
      url: absoluteUrl(`/portfolio/${item.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
