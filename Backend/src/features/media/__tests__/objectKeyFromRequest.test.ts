import { describe, expect, it } from "vitest";
import { objectKeyFromRequest } from "../objectKeyFromRequest.js";

describe("objectKeyFromRequest", () => {
  it("joins Express 5 array splat segments with /", () => {
    expect(
      objectKeyFromRequest(
        ["uploads", "834bac9d-f161-499b-8256-129cd573b58c.jpg"],
        "/uploads/834bac9d-f161-499b-8256-129cd573b58c.jpg",
      ),
    ).toBe("uploads/834bac9d-f161-499b-8256-129cd573b58c.jpg");
  });

  it("accepts string splat", () => {
    expect(objectKeyFromRequest("uploads/a.jpg", "/uploads/a.jpg")).toBe(
      "uploads/a.jpg",
    );
  });

  it("falls back to mounted path", () => {
    expect(objectKeyFromRequest(undefined, "/uploads/a.jpg")).toBe(
      "uploads/a.jpg",
    );
  });
});
