import { describe, expect, it } from "vitest";
import { upgradePortfolioDoc, upgradeServiceDoc, upgradeSiteDocument } from "../mediaDefaults.js";

describe("upgradeServiceDoc", () => {
  it("moves legacy placeholders to the service's own artwork", () => {
    const doc = upgradeServiceDoc("web-development", {
      leadImagePath: "/services/editorial/lead-dev.svg",
      cardImagePath: "/services/editorial/rail-photo.svg",
      deliveryRailImagePath: "/services/editorial/rail-photo.svg",
      deliveryRailTileCaption: "EDITORIAL DEMO",
      pairA: { left: { path: "/services/editorial/pair-a-left.svg", tileCaption: "EDITORIAL DEMO" } },
    });
    expect(doc.leadImagePath).toBe("/services/editorial/web-development/lead.svg");
    expect(doc.cardImagePath).toBe("/services/editorial/web-development/card.svg");
    expect(doc.deliveryRailImagePath).toBe("/services/editorial/web-development/rail.svg");
    expect(doc.deliveryRailTileCaption).toBe("GreenTech");
    expect(doc.pairA).toEqual({
      left: { path: "/services/editorial/web-development/pair-a-left.svg", tileCaption: "GreenTech" },
    });
  });

  it("never touches CMS uploads", () => {
    const doc = upgradeServiceDoc("seo", { leadImagePath: "/media/uploads/hero.jpg" });
    expect(doc.leadImagePath).toBe("/media/uploads/hero.jpg");
  });
});

describe("site documents and portfolio", () => {
  it("fills the about portrait and swaps why-choose photos", () => {
    const about = upgradeSiteDocument("about", { groupPortrait: { src: null } });
    expect(about.groupPortrait).toMatchObject({ src: "/about/group-portrait.svg", assetStatus: "ready" });
    const why = upgradeSiteDocument("why_choose", { media: { largeImage: { src: "/why-choose/large.jpg" } } });
    expect(JSON.stringify(why)).toContain("/why-choose/large.svg");
  });

  it("swaps stock portfolio JPG covers only", () => {
    expect(upgradePortfolioDoc({ coverPath: "/portfolio/lumen-shop.jpg" }).coverPath).toBe("/portfolio/lumen-shop.svg");
    expect(upgradePortfolioDoc({ coverPath: "/media/uploads/x.jpg" }).coverPath).toBe("/media/uploads/x.jpg");
  });
});
