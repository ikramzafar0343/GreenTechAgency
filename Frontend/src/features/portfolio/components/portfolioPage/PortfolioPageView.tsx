"use client";

import { useMemo, useState } from "react";
import { ArtworkGallery } from "@/features/portfolio/components/portfolioPage/ArtworkGallery";
import { MediaGrid } from "@/features/portfolio/components/portfolioPage/MediaGrid";
import { PortfolioCategoryTabs } from "@/features/portfolio/components/portfolioPage/PortfolioCategoryTabs";
import { PortfolioIntro } from "@/features/portfolio/components/portfolioPage/PortfolioIntro";
import { PortfolioSubfilterCapsule } from "@/features/portfolio/components/portfolioPage/PortfolioSubfilterCapsule";
import { SocialGridGallery } from "@/features/portfolio/components/portfolioPage/SocialGridGallery";
import { WebsiteGallery } from "@/features/portfolio/components/portfolioPage/WebsiteGallery";
import {
  defaultSocialType,
  defaultWebsiteType,
  filterWebsites,
} from "@/features/portfolio/lib/portfolioPageFilters";
import type {
  PortfolioCategory,
  PortfolioPageData,
  SocialType,
  WebsiteType,
} from "@/features/portfolio/model/portfolioPageTypes";
import { PORTFOLIO_CATEGORIES } from "@/features/portfolio/model/portfolioPageTypes";
import styles from "@/features/portfolio/styles/portfolioPage.module.css";

const WEBSITE_FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "ecommerce" as const, label: "Ecommerce" },
  { id: "staticWebsite" as const, label: "Static Website" },
];

const SOCIAL_FILTERS = [
  { id: "socialPost" as const, label: "Social Post" },
  { id: "socialGrid" as const, label: "Social Grid" },
];

type PortfolioPageViewProps = {
  data: PortfolioPageData;
};

export function PortfolioPageView({ data }: PortfolioPageViewProps) {
  const [category, setCategory] = useState<PortfolioCategory>("websites");
  const [websiteType, setWebsiteType] = useState<WebsiteType>(defaultWebsiteType());
  const [socialType, setSocialType] = useState<SocialType>(defaultSocialType());

  const websites = useMemo(
    () => filterWebsites(data.websites, websiteType),
    [data.websites, websiteType],
  );

  function onCategoryChange(next: PortfolioCategory) {
    setCategory(next);
    if (next === "websites") {
      setWebsiteType(defaultWebsiteType());
    }
    if (next === "socialMedia") {
      setSocialType(defaultSocialType());
    }
  }

  return (
    <main className={styles.page} data-header-surface="light">
      <div className={styles.shell}>
        <PortfolioIntro
          heading={data.settings.heading}
          intro={data.settings.intro}
        />
        <PortfolioCategoryTabs active={category} onChange={onCategoryChange} />

        {category === "websites" ? (
          <div className={styles.tabsWrap}>
            <PortfolioSubfilterCapsule
              label="Website types"
              options={WEBSITE_FILTERS}
              value={websiteType}
              onChange={setWebsiteType}
            />
          </div>
        ) : null}

        {category === "socialMedia" ? (
          <div className={styles.tabsWrap}>
            <PortfolioSubfilterCapsule
              label="Social media types"
              options={SOCIAL_FILTERS}
              value={socialType}
              onChange={setSocialType}
            />
          </div>
        ) : null}

        {PORTFOLIO_CATEGORIES.map((item) => {
          const selected = item.id === category;
          return (
            <div
              key={item.id}
              className={styles.panel}
              role="tabpanel"
              id={`portfolio-panel-${item.id}`}
              aria-labelledby={`portfolio-tab-${item.id}`}
              hidden={!selected}
              inert={!selected ? true : undefined}
            >
              {selected ? renderPanel(item.id) : null}
            </div>
          );
        })}
      </div>
    </main>
  );

  function renderPanel(id: PortfolioCategory) {
    switch (id) {
      case "websites":
        return <WebsiteGallery items={websites} />;
      case "logoDesign":
        return (
          <ArtworkGallery items={data.logoDesign} emptyLabel="Logo Design" />
        );
      case "socialMedia":
        return socialType === "socialGrid" ? (
          <SocialGridGallery items={data.socialGrids} />
        ) : (
          <ArtworkGallery items={data.socialPosts} emptyLabel="Social Post" />
        );
      case "businessCards":
        return (
          <MediaGrid
            items={data.businessCards}
            variant="business"
            emptyLabel="Business Cards"
          />
        );
      case "photography":
        return (
          <MediaGrid
            items={data.photography}
            variant="photography"
            emptyLabel="Photography"
          />
        );
      case "printDesign":
        return (
          <MediaGrid
            items={data.printDesign}
            variant="print"
            emptyLabel="Print Design"
          />
        );
      default:
        return null;
    }
  }
}
