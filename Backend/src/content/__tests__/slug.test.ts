import { describe, expect, it } from "vitest";
import { AppError } from "../../http/errors.js";
import { assertSlug } from "../slug.js";
import { parseRichDoc } from "../richText.js";

describe("assertSlug", () => {
  it("accepts kebab-case slugs", () => {
    expect(assertSlug("web-development")).toBe("web-development");
  });

  it("rejects invalid slugs", () => {
    expect(() => assertSlug("Web Dev")).toThrow(AppError);
  });
});

describe("parseRichDoc", () => {
  it("parses paragraph and heading blocks", () => {
    const doc = parseRichDoc([
      { type: "paragraph", text: "Hello" },
      { type: "heading", level: 2, text: "Title" },
    ]);
    expect(doc).toHaveLength(2);
  });

  it("rejects unsupported block types", () => {
    expect(() => parseRichDoc([{ type: "script", text: "x" }])).toThrow(
      AppError,
    );
  });
});

describe("parseRichDoc lists", () => {
  it("accepts ordered and unordered lists", () => {
    const doc = parseRichDoc([
      { type: "list", ordered: true, items: ["One", "Two | https://example.com"] },
    ]);
    expect(doc[0]).toEqual({ type: "list", ordered: true, items: ["One", "Two | https://example.com"] });
  });

  it("rejects empty lists", () => {
    expect(() => parseRichDoc([{ type: "list", items: [] }])).toThrow(/at least one item/);
  });
});
