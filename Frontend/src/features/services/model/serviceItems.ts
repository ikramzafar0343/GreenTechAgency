export type ServiceItem = {
  id: string;
  slug: string;
  title: string;
  label: string;
  summary: string;
};

export const SERVICE_ITEMS: readonly ServiceItem[] = [
  {
    id: "web-development",
    slug: "web-development",
    title: "Web Development",
    label: "FOR FAST, SCALABLE WEBSITES",
    summary:
      "High-performance websites built for speed, scalability, and conversion.",
  },
  {
    id: "mobile-app-development",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    label: "FOR CONNECTED MOBILE EXPERIENCES",
    summary:
      "Native and cross-platform apps that keep customers engaged on every device.",
  },
  {
    id: "ecommerce-development",
    slug: "ecommerce-development",
    title: "Ecommerce Development",
    label: "FOR HIGH-CONVERTING ONLINE STORES",
    summary:
      "Ecommerce experiences designed to sell, scale, and retain shoppers.",
  },
  {
    id: "ui-ux-design",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    label: "FOR INTUITIVE DIGITAL EXPERIENCES",
    summary:
      "Clear interfaces and user journeys that make complex products feel simple.",
  },
  {
    id: "content-marketing",
    slug: "content-marketing",
    title: "Content Marketing",
    label: "FOR CONTENT THAT BUILDS AUDIENCE",
    summary:
      "Strategic content systems that attract, educate, and convert buyers.",
  },
  {
    id: "copywriting",
    slug: "copywriting",
    title: "Copywriting",
    label: "FOR WORDS THAT CONVERT",
    summary:
      "Persuasive messaging for websites, campaigns, and product storytelling.",
  },
  {
    id: "digital-marketing",
    slug: "digital-marketing",
    title: "Digital Marketing",
    label: "FOR TRAFFIC, LEADS & CONVERSIONS",
    summary:
      "Paid and organic programs that grow visibility and qualified demand.",
  },
  {
    id: "social-media-marketing",
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    label: "FOR ENGAGED SOCIAL AUDIENCES",
    summary:
      "Channel strategy and creative that turns attention into community growth.",
  },
  {
    id: "search-engine-optimization",
    slug: "search-engine-optimization",
    title: "Search Engine Optimization",
    label: "FOR STRONGER SEARCH VISIBILITY",
    summary:
      "Technical and content SEO that improves rankings and organic acquisition.",
  },
  {
    id: "generative-engine-optimization",
    slug: "generative-engine-optimization",
    title: "Generative Engine Optimization",
    label: "FOR VISIBILITY IN AI SEARCH",
    summary:
      "Optimization for generative engines so your brand surfaces in AI answers.",
  },
  {
    id: "artificial-intelligence",
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    label: "FOR INTELLIGENT BUSINESS AUTOMATION",
    summary:
      "AI systems that automate workflows, insights, and customer experiences.",
  },
  {
    id: "augmented-reality",
    slug: "augmented-reality",
    title: "Augmented Reality",
    label: "FOR INTERACTIVE PRODUCT EXPERIENCES",
    summary:
      "AR experiences that help customers explore products in real context.",
  },
  {
    id: "virtual-reality",
    slug: "virtual-reality",
    title: "Virtual Reality",
    label: "FOR IMMERSIVE BRAND EXPERIENCES",
    summary:
      "Immersive VR environments for training, storytelling, and engagement.",
  },
  {
    id: "digital-branding-creatives",
    slug: "digital-branding-creatives",
    title: "Digital Branding & Creatives",
    label: "FOR A DISTINCTIVE BRAND IDENTITY",
    summary:
      "Brand systems and creative assets that make your business unmistakable.",
  },
  {
    id: "it-resource-outsourcing",
    slug: "it-resource-outsourcing",
    title: "IT Resource Outsourcing",
    label: "FOR FLEXIBLE TECH TALENT",
    summary:
      "Dedicated engineering and digital specialists that extend your team.",
  },
  {
    id: "video-animation-2d-3d",
    slug: "video-animation-2d-3d",
    title: "2D/3D Video Animation",
    label: "FOR MOTION THAT CAPTIVATES",
    summary:
      "Motion design and animation that explain products and elevate campaigns.",
  },
] as const;

export const SERVICES_INTRO = {
  eyebrow: "OUR SERVICES",
  heading: "Digital Solutions Built for Business Growth",
  supporting:
    "Development, design, marketing and emerging technology services built to help businesses grow online.",
} as const;

export const SERVICE_LOGO_PATH = "/images/brand/logo-mark.png";

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICE_ITEMS.find((service) => service.slug === slug);
}

export function getServiceHref(slug: string): string {
  return `/services/${slug}`;
}
