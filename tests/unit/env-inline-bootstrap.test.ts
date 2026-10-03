import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

describe("assertProductionEnv inline bootstrap", () => {
  const originalCwd = process.cwd();
  const originalEnv = { ...process.env };
  let tmp = "";

  afterEach(() => {
    process.chdir(originalCwd);
    for (const key of Object.keys(process.env)) {
      if (!(key in originalEnv)) delete process.env[key];
    }
    for (const key of Object.keys(originalEnv)) {
      process.env[key] = originalEnv[key];
    }
    if (tmp && fs.existsSync(tmp)) {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  it("creates secrets during next start path without external script", async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "derakhshan-inline-env-"));
    process.chdir(tmp);
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.SEED_ADMIN_PASSWORD;
    process.env.NODE_ENV = "production";

    const { assertProductionEnv, readAuthSecretRaw } = await import("@/server/env");
    expect(() => assertProductionEnv()).not.toThrow();
    expect(readAuthSecretRaw().length).toBeGreaterThanOrEqual(32);
    expect((process.env.SEED_ADMIN_PASSWORD || "").length).toBeGreaterThanOrEqual(8);
    expect(fs.existsSync(path.join(tmp, "data/production.env"))).toBe(true);
  });
});
