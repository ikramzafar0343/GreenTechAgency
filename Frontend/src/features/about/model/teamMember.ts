export type TeamMember = {
  id: string;
  fullName: string;
  role: string;
  imageUrl: string;
  imageAlt: string;
  imageFocalPointX: number;
  imageFocalPointY: number;
  profileUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  /** Local visual scaffolding only — not real staff identities. */
  previewOnly: boolean;
};
