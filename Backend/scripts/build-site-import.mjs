import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = join(root, "Backend/data/import");

function extractTestimonials() {
  const files = [
    "Frontend/src/features/testimonials/model/testimonialItemsA.ts",
    "Frontend/src/features/testimonials/model/testimonialItemsB.ts",
  ];
  const items = [];
  for (const rel of files) {
    const src = readFileSync(join(root, rel), "utf8");
    const re =
      /id:\s*"([^"]+)"[\s\S]*?companyName:\s*"([^"]*)"[\s\S]*?companyLogoUrl:\s*([^,\n]+)[\s\S]*?location:\s*([^,\n]+)[\s\S]*?reviewerName:\s*"([^"]*)"[\s\S]*?reviewerRole:\s*([^,\n]+)[\s\S]*?reviewerPhotoUrl:\s*([^,\n]+)[\s\S]*?quote:\s*"((?:\\.|[^"])*)"[\s\S]*?emphasisText:\s*([^,\n]+)[\s\S]*?rating:\s*([^,\n]+)[\s\S]*?ratingScale:\s*([0-9]+)[\s\S]*?sourceUrl:\s*([^,\n]+)[\s\S]*?displayOrder:\s*([0-9]+)[\s\S]*?featured:\s*(true|false)/g;
    let m;
    while ((m = re.exec(src))) {
      const parseNullableString = (raw) => {
        const t = raw.trim();
        if (t === "null") return null;
        try {
          return JSON.parse(t);
        } catch {
          return t.replace(/^"|"$/g, "");
        }
      };
      const ratingRaw = m[10].trim();
      items.push({
        id: m[1],
        sortOrder: Number(m[13]),
        featured: m[14] === "true",
        doc: {
          companyName: m[2],
          companyLogoUrl: parseNullableString(m[3]),
          location: parseNullableString(m[4]),
          reviewerName: m[5],
          reviewerRole: parseNullableString(m[6]),
          reviewerPhotoUrl: parseNullableString(m[7]),
          quote: m[8].replace(/\\"/g, '"'),
          emphasisText: parseNullableString(m[9]),
          rating: ratingRaw === "null" ? null : Number(ratingRaw),
          ratingScale: Number(m[11]),
          sourceUrl: parseNullableString(m[12]),
        },
      });
    }
  }
  return items;
}

const testimonials = extractTestimonials();
writeFileSync(
  join(outDir, "testimonials.json"),
  JSON.stringify(testimonials, null, 2),
);
console.log("testimonials", testimonials.length);

const footerSrc = readFileSync(
  join(root, "Frontend/src/features/footer/model/defaultFooterSettings.ts"),
  "utf8",
);
// Store a simplified footer snapshot by evaluating via dynamic import is hard;
// write from known DEFAULT values already in repo as JSON copy.
const footer = {
  brandName: "GreenTech Agency",
  logoUrl: "/logo.png",
  showClosingCta: false,
  ctaEyebrow: "LET'S GET STARTED",
  ctaHeading: "DISCUSS YOUR REQUIREMENTS",
  ctaBody:
    "Tell us about your website, software, design, or digital growth project. We’ll help define the priorities, scope, and next steps.",
  ctaLabel: "DISCUSS YOUR PROJECT",
  ctaHref: "/contact",
  showCtaArrow: true,
  ctaEntryAnimation: true,
  contact: {
    address: "Digital product studio — design, engineering, and growth.",
    email: "hello@greentechagency.com",
    phone: null,
    hours: null,
    mapUrl: null,
  },
  showBrandSignature: true,
  copyrightName: "GreenTech Agency",
  privacyHref: "/privacy",
  termsHref: "/terms",
  groupTitles: {
    company: "Overview",
    development: "Smart Technology Solutions",
    marketing: "Digital Growth & Marketing",
    additional: "Emerging Technology",
  },
  socialLinks: [
    {
      id: "facebook",
      platform: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/",
      displayOrder: 1,
    },
    {
      id: "instagram",
      platform: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/",
      displayOrder: 2,
    },
    {
      id: "youtube",
      platform: "youtube",
      label: "YouTube",
      url: "https://www.youtube.com/",
      displayOrder: 3,
    },
    {
      id: "linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/",
      displayOrder: 4,
    },
    {
      id: "behance",
      platform: "behance",
      label: "Behance",
      url: "https://www.behance.net/",
      displayOrder: 5,
    },
  ],
};
writeFileSync(join(outDir, "footer.json"), JSON.stringify(footer, null, 2));
console.log("footer", Boolean(footerSrc));

const sectionsExtra = [
  {
    key: "faq",
    visible: true,
    doc: {
      eyebrow: "FREQUENTLY ASKED QUESTIONS",
      heading: "Questions Before We Get Started?",
      introduction:
        "Find answers about our digital services, project planning, pricing, and ongoing support.",
      ctaLabel: "Start Your Project",
      ctaHref: "/contact",
      featuredIds: [],
      maxItems: 24,
    },
  },
  {
    key: "testimonials",
    visible: true,
    doc: {
      eyebrow: "CLIENT EXPERIENCES",
      heading: "What Our Clients Say",
      introduction: "Hear from the people behind the projects.",
      ctaLabel: null,
      ctaHref: null,
      featuredIds: [],
      maxItems: 24,
    },
  },
  {
    key: "stats",
    visible: true,
    doc: {
      eyebrow: null,
      heading: "Results that stay measurable",
      introduction: "Outcomes we track with clients over time.",
      ctaLabel: null,
      ctaHref: null,
      featuredIds: [],
      maxItems: 8,
    },
  },
];
writeFileSync(
  join(outDir, "sections-extra.json"),
  JSON.stringify(sectionsExtra, null, 2),
);
console.log("sections-extra", sectionsExtra.length);
