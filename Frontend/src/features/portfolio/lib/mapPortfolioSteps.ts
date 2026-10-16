import type { PortfolioProject } from "@/features/portfolio/model/types";
import type { PortfolioTimelineStep } from "@/features/portfolio/model/timelineTypes";

export function mapPortfolioSteps(
  projects: readonly PortfolioProject[],
): PortfolioTimelineStep[] {
  return projects
    .filter((project) => Boolean(project.coverUrl))
    .map((project) => ({
      id: project.id,
      title: project.title,
      timeLabel: project.category,
      description: project.description,
      imageUrl: project.coverUrl as string,
      imageAlt: project.clientName
        ? `${project.title} for ${project.clientName}`
        : `${project.title} project preview`,
    }));
}
