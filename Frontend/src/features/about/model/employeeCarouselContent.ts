import type { TeamMember } from "@/features/about/model/teamMember";

/**
 * Preview-only portraits for carousel layout until real published staff exist.
 * Replace these with approved employee records; do not treat as real identities.
 */
export const PREVIEW_TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: "preview-01",
    fullName: "Preview Portrait 01",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutTeamCollaboration01.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 50,
    imageFocalPointY: 32,
    profileUrl: null,
    sortOrder: 1,
    isPublished: true,
    previewOnly: true,
  },
  {
    id: "preview-02",
    fullName: "Preview Portrait 02",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutCreativeWorkshop02.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 48,
    imageFocalPointY: 30,
    profileUrl: null,
    sortOrder: 2,
    isPublished: true,
    previewOnly: true,
  },
  {
    id: "preview-03",
    fullName: "Preview Portrait 03",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutStudioTeam03.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 52,
    imageFocalPointY: 28,
    profileUrl: null,
    sortOrder: 3,
    isPublished: true,
    previewOnly: true,
  },
  {
    id: "preview-04",
    fullName: "Preview Portrait 04",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutWorkspaceMeeting04.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 50,
    imageFocalPointY: 35,
    profileUrl: null,
    sortOrder: 4,
    isPublished: true,
    previewOnly: true,
  },
  {
    id: "preview-05",
    fullName: "Preview Portrait 05",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutDesignReview05.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 50,
    imageFocalPointY: 34,
    profileUrl: null,
    sortOrder: 5,
    isPublished: true,
    previewOnly: true,
  },
  {
    id: "preview-06",
    fullName: "Preview Portrait 06",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutDeveloperCollaboration06.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 50,
    imageFocalPointY: 36,
    profileUrl: null,
    sortOrder: 6,
    isPublished: true,
    previewOnly: true,
  },
  {
    id: "preview-07",
    fullName: "Preview Portrait 07",
    role: "Sample role — replace with published staff",
    imageUrl: "/images/about/photoFan/aboutTeamConversation07.jpg",
    imageAlt: "Preview portrait for team carousel layout",
    imageFocalPointX: 50,
    imageFocalPointY: 30,
    profileUrl: null,
    sortOrder: 7,
    isPublished: true,
    previewOnly: true,
  },
] as const;

export function getPublishedTeamMembers(
  members: readonly TeamMember[],
): TeamMember[] {
  return members
    .filter((member) => member.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
