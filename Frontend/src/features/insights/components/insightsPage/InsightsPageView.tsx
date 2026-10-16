"use client";

import { useState } from "react";
import { InsightsClosingCta } from "@/features/insights/components/insightsPage/InsightsClosingCta";
import { InsightsGallery } from "@/features/insights/components/insightsPage/InsightsGallery";
import { InsightsIntro } from "@/features/insights/components/insightsPage/InsightsIntro";
import { InsightsToolbar } from "@/features/insights/components/insightsPage/InsightsToolbar";
import type {
  InsightsPageData,
  InsightsViewMode,
} from "@/features/insights/model/insightsPageTypes";
import styles from "@/features/insights/styles/insightsPage.module.css";

type InsightsPageViewProps = {
  data: InsightsPageData;
};

export function InsightsPageView({ data }: InsightsPageViewProps) {
  const [mode, setMode] = useState<InsightsViewMode>("large");

  return (
    <main
      id="main-content"
      className={styles.page}
      data-header-surface="light"
      data-mode={mode}
    >
      <div className={styles.shell}>
        <InsightsIntro
          heading={data.settings.heading}
          intro={data.settings.intro}
        />
        <InsightsToolbar mode={mode} onModeChange={setMode} />
        <InsightsGallery articles={data.articles} />
        <InsightsClosingCta
          heading={data.settings.ctaHeading}
          label={data.settings.ctaLabel}
          href={data.settings.ctaHref}
        />
      </div>
    </main>
  );
}
