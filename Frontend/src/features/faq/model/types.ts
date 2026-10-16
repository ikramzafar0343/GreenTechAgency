export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
};

export type FaqSectionData = {
  eyebrow: string;
  heading: string;
  supportingText: string;
  contactPrompt: string;
  ctaLabel: string;
  ctaHref: string;
  initialOpenId: string | null;
  animationEnabled: boolean;
  homepageOrder: number;
  items: FaqItem[];
};
