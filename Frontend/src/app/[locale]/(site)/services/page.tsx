import type { Metadata } from "next";
import { ServicesHubPage } from "@/features/services/components/ServicesHubPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | GreenTech Agency",
  description:
    "Development, design, marketing, and emerging technology services built to help businesses grow online.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHubPage />
    </main>
  );
}
