/**
 * Legacy placeholder paths → per-page illustrations shipped in Frontend/public.
 * Only exact legacy placeholders are replaced; anything an admin uploaded
 * (e.g. /media/uploads/...) is left untouched.
 */
type Json = Record<string, unknown>;

const LEGACY_LEADS = new Set(
  ["dev", "marketing", "emerging", "creative"].map((k) => `/services/editorial/lead-${k}.svg`),
);
const LEGACY_PAIRS: Record<string, string> = {
  "/services/editorial/pair-a-left.svg": "pair-a-left",
  "/services/editorial/pair-a-right.svg": "pair-a-right",
  "/services/editorial/pair-b-left.svg": "pair-b-left",
  "/services/editorial/pair-b-right.svg": "pair-b-right",
};
const LEGACY_RAIL = "/services/editorial/rail-photo.svg";
/** Placeholder caption the old admin editor saved under every image tile. */
const DEMO_CAPTION = "EDITORIAL DEMO";

function isRecord(value: unknown): value is Json {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function servicePath(slug: string, path: unknown, key: string): unknown {
  if (typeof path !== "string") {
    return path;
  }
  if (LEGACY_LEADS.has(path)) {
    return `/services/editorial/${slug}/lead.svg`;
  }
  const pair = LEGACY_PAIRS[path];
  if (pair) {
    return `/services/editorial/${slug}/${pair}.svg`;
  }
  if (path === LEGACY_RAIL) {
    return `/services/editorial/${slug}/${key === "cardImagePath" ? "card" : "rail"}.svg`;
  }
  return path;
}

/** Returns a copy of a service doc with legacy media paths replaced. */
export function upgradeServiceDoc(slug: string, input: unknown): Json {
  const doc: Json = isRecord(input) ? structuredClone(input) : {};
  for (const key of ["leadImagePath", "cardImagePath", "deliveryRailImagePath"]) {
    if (key in doc) {
      doc[key] = servicePath(slug, doc[key], key);
    }
  }
  if (doc.deliveryRailTileCaption === DEMO_CAPTION) {
    doc.deliveryRailTileCaption = "GreenTech";
  }
  if ("cardImagePath" in doc && !doc.cardImagePath) {
    doc.cardImagePath = `/services/editorial/${slug}/card.svg`;
  }
  for (const pairKey of ["pairA", "pairB"]) {
    const pair = doc[pairKey];
    if (!isRecord(pair)) continue;
    for (const side of ["left", "right"]) {
      const image = pair[side];
      if (isRecord(image)) {
        image.path = servicePath(slug, image.path, "pair");
        if (image.tileCaption === DEMO_CAPTION) image.tileCaption = "GreenTech";
      }
    }
  }
  return doc;
}

const SECTION_SWAPS: Record<string, Record<string, string>> = {
  impact: {
    "/services/editorial/rail-photo.svg": "/impact/delivery.svg",
    "/services/editorial/lead-dev.svg": "/impact/collaboration.svg",
  },
  why_choose: {
    "/why-choose/large.jpg": "/why-choose/large.svg",
    "/why-choose/small.jpg": "/why-choose/small.svg",
  },
};

function swapStrings(value: unknown, swaps: Record<string, string>): unknown {
  if (typeof value === "string") {
    if (value === DEMO_CAPTION) return "GreenTech";
    return swaps[value] ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => swapStrings(item, swaps));
  }
  if (isRecord(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, swapStrings(v, swaps)]));
  }
  return value;
}

const ACHIEVEMENT_ART = ["development", "design", "growth", "creative", "emerging", "partnership"];

/** Returns a copy of a site document (impact, why_choose, about) with legacy media upgraded. */
export function upgradeSiteDocument(key: string, input: unknown): Json {
  const swaps = SECTION_SWAPS[key];
  const doc = (swaps ? swapStrings(input, swaps) : structuredClone(input)) as Json;
  if (key !== "about" || !isRecord(doc)) {
    return doc;
  }
  const portrait = doc.groupPortrait;
  if (isRecord(portrait) && !portrait.src) {
    portrait.src = "/about/group-portrait.svg";
    portrait.assetStatus = "ready";
  }
  const achievements = doc.achievements;
  const rows = isRecord(achievements) && Array.isArray(achievements.rows) ? achievements.rows : [];
  rows.forEach((row: unknown, index: number) => {
    const preview = isRecord(row) ? row.previewImage : null;
    const art = ACHIEVEMENT_ART[index];
    if (isRecord(preview) && art && String(preview.src ?? "").startsWith("/images/about/photoFan/")) {
      preview.src = `/about/achievements/${art}.svg`;
    }
  });
  return doc;
}

/** Portfolio covers: stock JPGs → per-project SVG mockups. */
export function upgradePortfolioDoc(input: unknown): Json {
  const doc: Json = isRecord(input) ? structuredClone(input) : {};
  const cover = doc.coverPath;
  if (typeof cover === "string" && /^\/portfolio\/[a-z0-9-]+\.jpg$/.test(cover)) {
    doc.coverPath = cover.replace(/\.jpg$/, ".svg");
  }
  return doc;
}
