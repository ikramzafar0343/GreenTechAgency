export type TestimonialItem = {
  id: string;
  companyName: string;
  companyLogoUrl: string | null;
  location: string | null;
  reviewerName: string;
  reviewerRole: string | null;
  reviewerPhotoUrl: string | null;
  quote: string;
  emphasisText: string | null;
  rating: number | null;
  ratingScale: number;
  sourceUrl: string | null;
  displayOrder: number;
  featured: boolean;
};

export type TestimonialsTrustBadge = {
  eyebrow: string;
  value: string;
  label: string;
};

export type TestimonialsSectionData = {
  eyebrow: string;
  heading: string;
  supportingText: string;
  scrollAnimationEnabled: boolean;
  homepageOrder: number;
  trustBadge: TestimonialsTrustBadge;
  items: TestimonialItem[];
};
