import { afterEach, describe, expect, it, vi } from "vitest";
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
    vi.restoreAllMocks();
  });

  it("creates secrets on durable disk when autobootstrap is allowed", async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "derakhshan-inline-env-"));
    process.chdir(tmp);
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.SEED_ADMIN_PASSWORD;
    delete process.env.RENDER;
    delete process.env.RENDER_SERVICE_ID;
    delete process.env.RENDER_INSTANCE_ID;
    process.env.ALLOW_SECRET_AUTOBOOTSTRAP = "1";
    process.env.NODE_ENV = "production";

    vi.resetModules();
    const warns: string[] = [];
    vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
      warns.push(args.map(String).join(" "));
    });

    const { assertProductionEnv, readAuthSecretRaw } = await import("@/server/env");
    expect(() => assertProductionEnv()).not.toThrow();
    expect(readAuthSecretRaw().length).toBeGreaterThanOrEqual(32);
    expect((process.env.SEED_ADMIN_PASSWORD || "").length).toBeGreaterThanOrEqual(8);
    expect(fs.existsSync(path.join(tmp, "data/production.env"))).toBe(true);

    const file = fs.readFileSync(path.join(tmp, "data/production.env"), "utf8");
    const seed = file.match(/SEED_ADMIN_PASSWORD=(.*)/)?.[1] || "";
    expect(warns.join("\n").includes(seed)).toBe(false);
  });

  it("refuses rotating secrets on Render without platform env", async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "derakhshan-inline-render-"));
    process.chdir(tmp);
    delete process.env.AUTH_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    delete process.env.SEED_ADMIN_PASSWORD;
    delete process.env.ALLOW_SECRET_AUTOBOOTSTRAP;
    process.env.RENDER = "true";
    process.env.NODE_ENV = "production";

    vi.resetModules();
    const { assertProductionEnv } = await import("@/server/env");
    expect(() => assertProductionEnv()).toThrow(/Refusing production start/);
  });
});
