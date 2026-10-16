import { assertNonEmptyString } from "../../content/slug.js";
import { AppError } from "../../http/errors.js";

export type FaqDoc = {
  question: string;
  answer: string;
};

export function parseFaqDoc(input: unknown): FaqDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid FAQ document");
  }
  const row = input as Record<string, unknown>;
  return {
    question: assertNonEmptyString(row.question, "question", 400),
    answer: assertNonEmptyString(row.answer, "answer", 8000),
  };
}

export function assertFaqPublishable(doc: FaqDoc): void {
  assertNonEmptyString(doc.question, "question");
  assertNonEmptyString(doc.answer, "answer");
}
