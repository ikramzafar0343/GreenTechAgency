import { describe, expect, it } from "vitest";
import { SITE_DOCUMENT_KEYS } from "../constants.js";

describe("SITE_DOCUMENT_KEYS", () => {
  it("includes marketing chrome keys", () => {
    for (const key of [
      "hero",
      "how_we_work",
      "why_choose",
      "impact",
      "cta",
      "footer",
      "about",
    ]) {
      expect(SITE_DOCUMENT_KEYS).toContain(key);
    }
  });
});
