import { afterEach, describe, expect, it, vi } from "vitest";
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
    vi.restoreAllMocks();
  });

  function prepareTmp() {
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
    delete process.env.RENDER;
    delete process.env.RENDER_SERVICE_ID;
    delete process.env.RENDER_INSTANCE_ID;
    delete process.env.FLY_APP_NAME;
    delete process.env.RAILWAY_ENVIRONMENT;
    delete process.env.ALLOW_SECRET_AUTOBOOTSTRAP;
    process.env.NODE_ENV = "production";
  }

  it("auto-creates data/production.env on durable disk when allowed", () => {
    prepareTmp();
    process.env.ALLOW_SECRET_AUTOBOOTSTRAP = "1";

    const requireTmp = createRequire(path.join(tmp, "package.json"));
    const { ensureProductionEnv } = requireTmp("./scripts/production-env.cjs") as {
      ensureProductionEnv: (opts?: { autoBootstrap?: boolean }) => {
        ok?: boolean;
        bootstrapped?: boolean;
      };
    };

    const warns: string[] = [];
    const warnSpy = vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
      warns.push(args.map(String).join(" "));
    });

    const result = ensureProductionEnv({ autoBootstrap: true });
    expect(result.ok).toBe(true);
    expect(result.bootstrapped).toBe(true);
    expect(process.env.AUTH_SECRET?.length).toBeGreaterThanOrEqual(32);
    expect((process.env.SEED_ADMIN_PASSWORD || "").length).toBeGreaterThanOrEqual(8);
    expect(fs.existsSync(path.join(tmp, "data/production.env"))).toBe(true);

    const file = fs.readFileSync(path.join(tmp, "data/production.env"), "utf8");
    const seed = file.match(/SEED_ADMIN_PASSWORD=(.*)/)?.[1] || "";
    const auth = file.match(/AUTH_SECRET=(.*)/)?.[1] || "";
    const joined = warns.join("\n");
    expect(joined.includes(seed)).toBe(false);
    expect(joined.includes(auth)).toBe(false);
    warnSpy.mockRestore();

    const again = ensureProductionEnv({ autoBootstrap: true });
    expect(again.bootstrapped).toBe(false);
  });

  it("refuses random bootstrap on Render and requires platform env", () => {
    prepareTmp();
    process.env.RENDER = "true";

    const requireTmp = createRequire(path.join(tmp, "package.json"));
    const { ensureProductionEnv, mustUsePlatformSecrets } = requireTmp(
      "./scripts/production-env.cjs",
    ) as {
      ensureProductionEnv: (opts?: { autoBootstrap?: boolean }) => unknown;
      mustUsePlatformSecrets: () => boolean;
    };

    expect(mustUsePlatformSecrets()).toBe(true);
    expect(() => ensureProductionEnv({ autoBootstrap: true })).toThrow(/Refusing production start/);

    process.env.AUTH_SECRET = "c".repeat(48);
    process.env.SEED_ADMIN_PASSWORD = "stable-from-render-panel";
    const ok = ensureProductionEnv({ autoBootstrap: true }) as { ok?: boolean; bootstrapped?: boolean };
    expect(ok.ok).toBe(true);
    expect(ok.bootstrapped).toBe(false);
  });
});
