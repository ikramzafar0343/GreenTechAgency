export type ServiceSpecialty = {
  id: string;
  label: string;
  href: string | null;
};

export type ServiceShowcaseEntry = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  href: string;
  imageSrc: string | null;
  imageAlt: string;
  specialties: readonly ServiceSpecialty[];
};

export type ServiceShowcaseGroup = {
  id: string;
  eyebrow: string;
  title: string;
  outlineLabel: string;
  entries: readonly ServiceShowcaseEntry[];
};

export type ServicesHubPageData = {
  eyebrow: string;
  heading: string;
  groups: readonly ServiceShowcaseGroup[];
};
