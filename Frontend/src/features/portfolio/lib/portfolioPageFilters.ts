import type {
  SocialType,
  WebsiteProject,
  WebsiteType,
} from "@/features/portfolio/model/portfolioPageTypes";

export function filterWebsites(
  items: readonly WebsiteProject[],
  subtype: WebsiteType,
): WebsiteProject[] {
  if (subtype === "all") {
    return [...items];
  }
  return items.filter((item) => item.websiteType === subtype);
}

export function defaultSocialType(): SocialType {
  return "socialPost";
}

export function defaultWebsiteType(): WebsiteType {
  return "all";
}
