import { describe, expect, it } from "vitest";
import type { Response } from "express";
import {
  enforceEmployeeRecordAccess,
  enforceOpsAccess,
  toEmployeeDirectoryRow,
} from "../accessPolicy.js";
import type { StaffRequest } from "../../../http/requireStaff.js";

function staffReq(role: string, method: string, path: string, body?: unknown): StaffRequest {
  return {
    method,
    path,
    body,
    staffSession: { user: { id: "emp-1", role } },
  } as unknown as StaffRequest;
}

function run(
  middleware: (req: StaffRequest, res: Response, next: (err?: unknown) => void) => void,
  req: StaffRequest,
): unknown {
  let result: unknown = "not-called";
  middleware(req, {} as Response, (err?: unknown) => {
    result = err ?? null;
  });
  return result;
}

describe("enforceOpsAccess", () => {
  it("blocks employees from admin-only resources", () => {
    const err = run(enforceOpsAccess("adminOnly"), staffReq("employee", "GET", "/"));
    expect(err).toMatchObject({ code: "FORBIDDEN" });
  });

  it("lets employees create and archive CRM records but not hard-delete", () => {
    const access = enforceOpsAccess("staff");
    expect(run(access, staffReq("employee", "POST", "/"))).toBeNull();
    expect(run(access, staffReq("employee", "POST", "/abc/archive"))).toBeNull();
    expect(run(access, staffReq("employee", "DELETE", "/abc"))).toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows admins everywhere", () => {
    expect(run(enforceOpsAccess("adminOnly"), staffReq("admin", "DELETE", "/x"))).toBeNull();
  });
});

describe("enforceEmployeeRecordAccess", () => {
  it("allows the directory listing and the employee's own record", () => {
    expect(run(enforceEmployeeRecordAccess, staffReq("employee", "GET", "/"))).toBeNull();
    expect(run(enforceEmployeeRecordAccess, staffReq("employee", "GET", "/emp-1"))).toBeNull();
  });

  it("blocks other employees' records and HR fields", () => {
    expect(run(enforceEmployeeRecordAccess, staffReq("employee", "GET", "/emp-2"))).toMatchObject({ code: "FORBIDDEN" });
    expect(
      run(enforceEmployeeRecordAccess, staffReq("employee", "PATCH", "/emp-1", { salary: 1, version: 1 })),
    ).toMatchObject({ code: "FORBIDDEN" });
    expect(
      run(enforceEmployeeRecordAccess, staffReq("employee", "PATCH", "/emp-1", { image: "/a.png", version: 1 })),
    ).toBeNull();
  });

  it("strips HR data from directory rows", () => {
    expect(toEmployeeDirectoryRow({ id: "1", name: "A", salary: 900, bankAccount: "x" })).toEqual({
      id: "1",
      name: "A",
    });
  });
});
