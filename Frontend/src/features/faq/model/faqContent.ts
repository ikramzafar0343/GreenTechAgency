import type { FaqSectionData } from "@/features/faq/model/types";

/** Approved storefront FAQ content until a CMS backend owns this section. */
export const FAQ_CONTENT: FaqSectionData = {
  eyebrow: "FREQUENTLY ASKED QUESTIONS",
  heading: "Questions Before We Get Started?",
  supportingText:
    "Find answers about our digital services, project planning, pricing, and ongoing support.",
  contactPrompt: "Have a project in mind?",
  ctaLabel: "Start Your Project",
  ctaHref: "/contact",
  initialOpenId: "faq-services",
  animationEnabled: true,
  homepageOrder: 80,
  items: [
    {
      id: "faq-services",
      question: "What digital services do you offer?",
      answer:
        "We provide web development, mobile app development, ecommerce development, UI/UX design, SEO, GEO, digital marketing, content marketing, social media marketing, branding, AI solutions, AR/VR, IT resource outsourcing, and 2D/3D animation.",
      displayOrder: 1,
    },
    {
      id: "faq-growth",
      question: "How can your digital services help grow my business?",
      answer:
        "We combine technology, design, search optimization, and digital marketing to help businesses increase online visibility, attract qualified traffic, generate leads, improve conversions, and build stronger digital experiences.",
      displayOrder: 2,
    },
    {
      id: "faq-custom",
      question: "Do you build custom websites and ecommerce platforms?",
      answer:
        "Yes. We develop custom, responsive, SEO-friendly websites and ecommerce solutions designed around your business requirements, customers, performance goals, and future scalability.",
      displayOrder: 3,
    },
    {
      id: "faq-seo-geo",
      question: "Do you provide SEO and Generative Engine Optimization (GEO)?",
      answer:
        "Yes. Our SEO and GEO services are designed to improve visibility across traditional search engines and AI-powered discovery platforms through technical optimization, content strategy, entity clarity, and search-intent-focused content.",
      displayOrder: 4,
    },
    {
      id: "faq-design-dev",
      question: "Can you handle both design and development?",
      answer:
        "Yes. Our team covers UI/UX design, branding, web development, mobile development, and digital experiences, allowing strategy, design, and technology to work together throughout the project.",
      displayOrder: 5,
    },
    {
      id: "faq-marketing",
      question: "Do you provide digital marketing after a website launches?",
      answer:
        "Yes. We support ongoing growth through SEO, content marketing, social media marketing, digital campaigns, conversion optimization, and performance-focused strategies.",
      displayOrder: 6,
    },
    {
      id: "faq-timeline",
      question: "How long does a website or digital project take?",
      answer:
        "Timelines depend on the project's scope, features, integrations, and complexity. After understanding your requirements, we provide a clear project roadmap, milestones, and estimated delivery timeline before development begins.",
      displayOrder: 7,
    },
    {
      id: "faq-start",
      question: "How do I get started with your team?",
      answer:
        "Start by telling us about your business, project requirements, goals, and challenges. We'll assess your needs, recommend the right digital solution, and outline the next steps for your project.",
      displayOrder: 8,
    },
  ],
};
