import { describe, expect, it } from "vitest";
import { assertSafeOpsPayload } from "../payloadGuard.js";

describe("assertSafeOpsPayload", () => {
  it("accepts ordinary records", () => {
    expect(() => assertSafeOpsPayload({ name: "Acme", tags: ["a"], meta: { stage: 2 } })).not.toThrow();
  });

  it("rejects credential keys and odd key names", () => {
    expect(() => assertSafeOpsPayload({ passwordHash: "x" })).toThrow(/not allowed/);
    expect(() => assertSafeOpsPayload({ "bad key": 1 })).toThrow(/not allowed/);
  });

  it("rejects deep nesting and oversized records", () => {
    expect(() => assertSafeOpsPayload({ a: { b: { c: { d: { e: { f: 1 } } } } } })).toThrow(/deeply/);
    expect(() => assertSafeOpsPayload({ note: "x".repeat(70_000) })).toThrow();
  });
});
