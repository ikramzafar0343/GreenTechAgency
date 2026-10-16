export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  clientName: string | null;
  summary: string;
  description: string;
  category: string;
  coverUrl: string | null;
  featured: boolean;
  sortOrder: number;
};

export type PortfolioSectionData = {
  heading: string;
  subtitle: string;
  projects: PortfolioProject[];
};
