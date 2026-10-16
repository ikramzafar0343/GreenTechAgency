import { BrandFamilySection } from "@/features/brands/components/BrandFamilySection";
import { FaqSection } from "@/features/faq/components/FaqSection";
import { HeroSection } from "@/features/hero/components/HeroSection";
import { HowWeWorkSection } from "@/features/how-we-work/components/HowWeWorkSection";
import { InsightsSection } from "@/features/insights/components/InsightsSection";
import { PortfolioSection } from "@/features/portfolio/components/PortfolioSection";
import { ServicesSection } from "@/features/services/components/ServicesSection";
import { StatsSection } from "@/features/stats/components/StatsSection";
import { TestimonialsSection } from "@/features/testimonials/components/TestimonialsSection";
import { WhyChooseUsSection } from "@/features/why-choose-us/components/WhyChooseUsSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <HeroSection />
      <BrandFamilySection />
      <ServicesSection />
      <WhyChooseUsSection />
      <PortfolioSection />
      <HowWeWorkSection />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <InsightsSection />
    </main>
  );
}
