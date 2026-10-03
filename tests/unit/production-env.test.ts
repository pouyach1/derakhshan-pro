import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

describe("production-env bootstrap", () => {
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

  it("auto-creates data/production.env when production secrets are missing", () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "derakhshan-env-"));
    fs.mkdirSync(path.join(tmp, "scripts"), { recursive: true });
    fs.copyFileSync(
      path.join(originalCwd, "scripts/production-env.cjs"),
      path.join(tmp, "scripts/production-env.cjs"),
    );
    fs.writeFileSync(path.join(tmp, "package.json"), '{"name":"tmp"}\n');

    process.chdir(tmp);
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.SEED_ADMIN_PASSWORD;
    process.env.NODE_ENV = "production";

    const requireTmp = createRequire(path.join(tmp, "package.json"));
    const { ensureProductionEnv } = requireTmp("./scripts/production-env.cjs") as {
      ensureProductionEnv: (opts?: { autoBootstrap?: boolean }) => {
        ok?: boolean;
        bootstrapped?: boolean;
      };
    };

    const result = ensureProductionEnv({ autoBootstrap: true });
    expect(result.ok).toBe(true);
    expect(result.bootstrapped).toBe(true);
    expect(process.env.AUTH_SECRET?.length).toBeGreaterThanOrEqual(32);
    expect((process.env.SEED_ADMIN_PASSWORD || "").length).toBeGreaterThanOrEqual(8);
    expect(fs.existsSync(path.join(tmp, "data/production.env"))).toBe(true);

    const again = ensureProductionEnv({ autoBootstrap: true });
    expect(again.bootstrapped).toBe(false);
  });
});
