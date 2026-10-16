import { AboutAwards } from "@/features/about/components/AboutAwards";
import { ClientsShowcaseSection } from "@/features/about/components/clientsShowcase/ClientsShowcaseSection";
import { AboutContact } from "@/features/about/components/AboutContact";
import { AboutGroupPortrait } from "@/features/about/components/AboutGroupPortrait";
import { AboutHero } from "@/features/about/components/AboutHero";
import { AboutManifesto } from "@/features/about/components/AboutManifesto";
import { AboutExploreServices } from "@/features/about/components/exploreServices/AboutExploreServices";
import { EmployeeCarousel } from "@/features/about/components/employeeCarousel/EmployeeCarousel";
import { getPublishedTeamMembers } from "@/features/about/model/employeeCarouselContent";
import type {
  AboutPageContent,
  AboutTeamMember,
} from "@/features/about/model/aboutPageTypes";
import type { TeamMember } from "@/features/about/model/teamMember";
import styles from "@/features/about/styles/aboutShell.module.css";

type AboutPageProps = {
  content: AboutPageContent;
};

function mapAboutTeam(members: readonly AboutTeamMember[]): TeamMember[] {
  return members.map((member) => ({
    id: member.id,
    fullName: member.name,
    role: member.role,
    imageUrl: member.imageSrc,
    imageAlt: member.alt,
    imageFocalPointX: 50,
    imageFocalPointY: 35,
    profileUrl: null,
    sortOrder: member.sortOrder,
    isPublished: true,
    previewOnly: false,
  }));
}

export function AboutPage({ content }: AboutPageProps) {
  const teamMembers = getPublishedTeamMembers(mapAboutTeam(content.team));

  return (
    <main
      className={`${styles.page} relative flex flex-1 flex-col`}
      data-header-surface="light"
    >
      <AboutHero content={content.hero} />
      <AboutGroupPortrait content={content.groupPortrait} />
      <AboutManifesto content={content.manifesto} />
      {teamMembers.length > 0 ? (
        <EmployeeCarousel members={teamMembers} />
      ) : null}
      <AboutExploreServices services={content.services} />
      <AboutAwards content={content.achievements} />
      <ClientsShowcaseSection content={content.clients} />
      <AboutContact content={content.contact} />
    </main>
  );
}
