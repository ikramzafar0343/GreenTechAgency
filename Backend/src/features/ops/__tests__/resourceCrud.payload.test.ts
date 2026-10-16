import { describe, expect, it } from "vitest";
import { createOpsResourceCrud } from "../resourceCrud.js";
import { opsClient } from "../../../db/schema/ops.js";

describe("ops resource payload unwrap", () => {
  it("exposes createOpsResourceCrud for clients table", () => {
    const crud = createOpsResourceCrud({
      table: opsClient,
      entityType: "ops_client",
    });
    expect(typeof crud.list).toBe("function");
    expect(typeof crud.create).toBe("function");
    expect(typeof crud.update).toBe("function");
    expect(typeof crud.archive).toBe("function");
  });
});
