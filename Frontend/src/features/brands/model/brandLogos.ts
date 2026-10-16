export type BrandLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type BrandRowConfig = {
  id: "upper" | "lower";
  direction: 1 | -1;
  logos: readonly BrandLogo[];
};

const toPublicSrc = (file: string) => `/${file.replace(/^logos\//, "brands/logos/")}`;

export const UPPER_LOGOS: readonly BrandLogo[] = [
  { name: "Gites", src: toPublicSrc("logos/gites.png"), width: 270, height: 115 },
  { name: "Tomorrowland", src: toPublicSrc("logos/tomorrowland.png"), width: 304, height: 182 },
  { name: "Brussels Airport", src: toPublicSrc("logos/brussels-airport.png"), width: 1590, height: 600 },
  { name: "IkZorg", src: toPublicSrc("logos/ikzorg.png"), width: 1590, height: 600 },
  { name: "GoodNews Coffee", src: toPublicSrc("logos/goodnews-coffee.png"), width: 270, height: 115 },
  { name: "David Lloyd", src: toPublicSrc("logos/david-lloyd.png"), width: 1590, height: 600 },
  { name: "Sequoia Support", src: toPublicSrc("logos/sequoia-support.png"), width: 1077, height: 309 },
  { name: "Collective Cafe Haarlem", src: toPublicSrc("logos/collective-cafe-haarlem.png"), width: 1914, height: 358 },
  { name: "Loop", src: toPublicSrc("logos/loop.png"), width: 270, height: 115 },
  { name: "Apostrophe", src: toPublicSrc("logos/apostrophe.png"), width: 270, height: 115 },
  { name: "Schoots Gunter", src: toPublicSrc("logos/schoots-gunter.png"), width: 270, height: 115 },
  { name: "Lantis Antwerpen", src: toPublicSrc("logos/lantis-antwerpen.png"), width: 1590, height: 600 },
  { name: "Panchos", src: toPublicSrc("logos/panchos.png"), width: 270, height: 115 },
  { name: "Mentalspot", src: toPublicSrc("logos/mentalspot.png"), width: 2560, height: 611 },
  { name: "Pad Thai", src: toPublicSrc("logos/pad-thai.png"), width: 270, height: 115 },
  { name: "Qualiko", src: toPublicSrc("logos/qualiko.png"), width: 1024, height: 324 },
  { name: "Infomedics", src: toPublicSrc("logos/infomedics.png"), width: 270, height: 115 },
  { name: "Retail", src: toPublicSrc("logos/logo-13.png"), width: 270, height: 115 },
  { name: "ap / art", src: toPublicSrc("logos/logo-24.png"), width: 270, height: 115 },
  { name: "Gemeente Amsterdam", src: toPublicSrc("logos/gemeente-amsterdam.png"), width: 270, height: 115 },
  { name: "Co-office", src: toPublicSrc("logos/co-office.png"), width: 270, height: 115 },
  { name: "Metapsych", src: toPublicSrc("logos/metapsych.png"), width: 500, height: 120 },
  { name: "Dar al Fahm", src: toPublicSrc("logos/dar-al-fahm.png"), width: 270, height: 115 },
  { name: "David Lloyd Mark", src: toPublicSrc("logos/logo-1.png"), width: 270, height: 115 },
  { name: "Bright", src: toPublicSrc("logos/bright.png"), width: 270, height: 115 },
] as const;

const LOWER_LOGOS: readonly BrandLogo[] = [
  { name: "Co-office", src: toPublicSrc("logos/co-office.png"), width: 270, height: 115 },
  { name: "Metapsych", src: toPublicSrc("logos/metapsych.png"), width: 500, height: 120 },
  { name: "Dar al Fahm", src: toPublicSrc("logos/dar-al-fahm.png"), width: 270, height: 115 },
  { name: "David Lloyd Mark", src: toPublicSrc("logos/logo-1.png"), width: 270, height: 115 },
  { name: "Bright", src: toPublicSrc("logos/bright.png"), width: 270, height: 115 },
  { name: "Gites", src: toPublicSrc("logos/gites.png"), width: 270, height: 115 },
  { name: "Tomorrowland", src: toPublicSrc("logos/tomorrowland.png"), width: 304, height: 182 },
  { name: "Brussels Airport", src: toPublicSrc("logos/brussels-airport.png"), width: 1590, height: 600 },
  { name: "IkZorg", src: toPublicSrc("logos/ikzorg.png"), width: 1590, height: 600 },
  { name: "GoodNews Coffee", src: toPublicSrc("logos/goodnews-coffee.png"), width: 270, height: 115 },
  { name: "David Lloyd", src: toPublicSrc("logos/david-lloyd.png"), width: 1590, height: 600 },
  { name: "Mentalspot", src: toPublicSrc("logos/mentalspot.png"), width: 2560, height: 611 },
  { name: "Pad Thai", src: toPublicSrc("logos/pad-thai.png"), width: 270, height: 115 },
  { name: "Qualiko", src: toPublicSrc("logos/qualiko.png"), width: 1024, height: 324 },
  { name: "Collective Cafe Haarlem", src: toPublicSrc("logos/collective-cafe-haarlem.png"), width: 1914, height: 358 },
  { name: "Loop", src: toPublicSrc("logos/loop.png"), width: 270, height: 115 },
  { name: "Apostrophe", src: toPublicSrc("logos/apostrophe.png"), width: 270, height: 115 },
  { name: "Infomedics", src: toPublicSrc("logos/infomedics.png"), width: 270, height: 115 },
  { name: "Schoots Gunter", src: toPublicSrc("logos/schoots-gunter.png"), width: 270, height: 115 },
  { name: "Retail", src: toPublicSrc("logos/logo-13.png"), width: 270, height: 115 },
  { name: "ap / art", src: toPublicSrc("logos/logo-24.png"), width: 270, height: 115 },
  { name: "Gemeente Amsterdam", src: toPublicSrc("logos/gemeente-amsterdam.png"), width: 270, height: 115 },
  { name: "Sequoia Support", src: toPublicSrc("logos/sequoia-support.png"), width: 1077, height: 309 },
  { name: "Lantis Antwerpen", src: toPublicSrc("logos/lantis-antwerpen.png"), width: 1590, height: 600 },
  { name: "Panchos", src: toPublicSrc("logos/panchos.png"), width: 270, height: 115 },
] as const;

export const BRAND_COPY = {
  eyebrow: "✦ Family and Brands",
  titleLineOne: "Stories worth telling,",
  titleLineTwo: "brands worth building",
} as const;

export const BRAND_ROWS: readonly BrandRowConfig[] = [
  { id: "upper", direction: 1, logos: UPPER_LOGOS },
  { id: "lower", direction: -1, logos: LOWER_LOGOS },
] as const;

export const VISUAL_COPIES = 3;
export const BASE_SPEED = 25;
