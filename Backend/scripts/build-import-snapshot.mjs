import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const outDir = join(__dirname, "../data/import");

const itemsSrc = readFileSync(
  join(root, "Frontend/src/features/services/model/serviceItems.ts"),
  "utf8",
);
const itemRe =
  /\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*summary:\s*\n?\s*"([^"]+)"/g;
const services = [];
let m;
let order = 1;
while ((m = itemRe.exec(itemsSrc))) {
  const [, id, slug, title, label, summary] = m;
  services.push({
    id,
    slug,
    sortOrder: order,
    featured: false,
    doc: {
      title,
      label,
      shortDescription: summary,
      detailedContent: [{ type: "paragraph", text: summary }],
      iconName: null,
      cardImagePath: null,
      cardImageAlt: "",
      heroHeadline: title,
      heroIntro: summary,
      storyLabel: "Overview",
      storyParagraphs: [summary],
      storyCtaLabel: "Contact us",
      storyCtaHref: "/contact",
      leadImagePath: null,
      leadImageAlt: "",
      principles: [],
      benefits: [],
      processSteps: [],
      faqs: [],
      relatedHeading: "Related services",
      relatedIntro: "",
      relatedSlugs: [],
      seoTitle: null,
      seoDescription: null,
      ctaLabel: null,
      ctaHref: null,
    },
  });
  order += 1;
}
writeFileSync(join(outDir, "services.json"), JSON.stringify(services, null, 2));
console.log("services", services.length);

const blogSrc = readFileSync(
  join(root, "Frontend/src/features/insights/model/insightsContent.ts"),
  "utf8",
);
const artRe =
  /id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*railLabel:\s*("(?:\\.|[^"])*"|null),\s*category:\s*"([^"]+)",\s*excerpt:\s*\n?\s*"([^"]+)",\s*coverUrl:\s*("(?:\\.|[^"])*"|null),\s*coverAlt:\s*"([^"]+)",\s*focalX:\s*([0-9.]+),\s*focalY:\s*([0-9.]+),\s*readTimeMinutes:\s*([0-9]+|null),\s*publishedAt:\s*("(?:\\.|[^"])*"|null),\s*href:\s*"[^"]+",\s*homepageOrder:\s*([0-9]+)/g;
const posts = [];
while ((m = artRe.exec(blogSrc))) {
  const rail = m[4] === "null" ? null : JSON.parse(m[4]);
  const cover = m[7] === "null" ? null : JSON.parse(m[7]);
  const read = m[11] === "null" ? null : Number(m[11]);
  const publishedAt = m[12] === "null" ? null : JSON.parse(m[12]);
  posts.push({
    id: m[1],
    slug: m[2],
    featured: false,
    homepageOrder: Number(m[13]),
    firstPublishedAt: publishedAt,
    doc: {
      title: m[3],
      excerpt: m[6],
      body: [{ type: "paragraph", text: m[6] }],
      coverPath: cover,
      coverAlt: m[8],
      railLabel: rail,
      category: m[5],
      authorDisplay: null,
      seoTitle: null,
      seoDescription: null,
      focalX: Number(m[9]),
      focalY: Number(m[10]),
      readTimeMinutes: read,
    },
  });
}
writeFileSync(join(outDir, "blog.json"), JSON.stringify(posts, null, 2));
console.log("blog", posts.length);
