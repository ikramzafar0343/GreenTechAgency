import { describe, expect, it } from "vitest";
import { detectImageMime } from "../vpsStorage.js";

describe("detectImageMime", () => {
  it("accepts JPEG magic bytes", () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    expect(detectImageMime(buf)).toEqual({ mime: "image/jpeg", ext: "jpg" });
  });

  it("accepts PNG magic bytes", () => {
    const buf = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
    ]);
    expect(detectImageMime(buf)).toEqual({ mime: "image/png", ext: "png" });
  });

  it("rejects unknown bytes", () => {
    expect(() => detectImageMime(Buffer.from([0x00, 0x01, 0x02]))).toThrow(
      /JPEG|PNG|WebP|GIF/,
    );
  });
});
