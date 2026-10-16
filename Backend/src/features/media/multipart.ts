import type { Request } from "express";
import busboy from "busboy";
import { AppError } from "../../http/errors.js";

const MAX_BYTES = 15_000_000;

export type ParsedMultipartImage = {
  buffer: Buffer;
  alt: string;
  decorative: boolean;
  visibility: "private" | "public";
};

/** Parse a single file field named "file" plus optional alt/decorative/visibility. */
export function parseMultipartImage(req: Request): Promise<ParsedMultipartImage> {
  return new Promise((resolve, reject) => {
    const bb = busboy({
      headers: req.headers,
      limits: { files: 1, fileSize: MAX_BYTES },
    });
    const chunks: Buffer[] = [];
    let gotFile = false;
    let alt = "";
    let decorative = false;
    let visibility: "private" | "public" = "private";
    let truncated = false;

    bb.on("file", (_name, stream) => {
      gotFile = true;
      stream.on("data", (d: Buffer) => {
        chunks.push(d);
      });
      stream.on("limit", () => {
        truncated = true;
      });
    });

    bb.on("field", (name, value) => {
      if (name === "alt") alt = String(value).slice(0, 500);
      if (name === "decorative") decorative = value === "true" || value === "1";
      if (name === "visibility" && value === "public") visibility = "public";
    });

    bb.on("error", (err) => {
      reject(err);
    });

    bb.on("finish", () => {
      if (truncated) {
        reject(new AppError("VALIDATION", `File exceeds ${MAX_BYTES} bytes`));
        return;
      }
      if (!gotFile) {
        reject(new AppError("VALIDATION", "Missing file field"));
        return;
      }
      resolve({
        buffer: Buffer.concat(chunks),
        alt,
        decorative,
        visibility,
      });
    });

    req.pipe(bb);
  });
}
