/**
 * Production environment guards shared by Node startup and runtime auth/bootstrap.
 * Cloudflare/OpenNext production must also set these secrets — demo fallbacks are disabled.
 *
 * On Node/Parspack, missing secrets are auto-bootstrapped once into data/production.env
 * via scripts/production-env.cjs so a fresh host can Start without panel env gymnastics.
 */

import { createRequire } from "node:module";
import path from "node:path";

const DEV_FALLBACK_SECRET = "dev-only-change-me-derakhshan-agency-secret-key-32b";
const SHOWCASE_FALLBACK_SECRET =
  "derakhshan-showcase-jwt-fallback-v1-replace-with-AUTH_SECRET-in-real-deploys";

const requireFromCwd = createRequire(path.join(process.cwd(), "package.json"));

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function isWeakAuthSecret(secret: string) {
  const normalized = secret.trim().toLowerCase();
  return (
    secret.trim().length < 32 ||
    normalized.startsWith("change-me") ||
    normalized.includes("replace-with") ||
    normalized === DEV_FALLBACK_SECRET ||
    normalized === SHOWCASE_FALLBACK_SECRET
  );
}

export function readAuthSecretRaw() {
  return (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
}

function assertInline() {
  const errors: string[] = [];
  const authSecret = readAuthSecretRaw();
  if (!authSecret || isWeakAuthSecret(authSecret)) {
    errors.push(
      "AUTH_SECRET must be a strong random value (min 32 characters). Do not use change-me / replace-with placeholders.",
    );
  }

  const seed = (process.env.SEED_ADMIN_PASSWORD || "").trim();
  if (seed.length < 8) {
    errors.push(
      "SEED_ADMIN_PASSWORD must be set (min 8 characters) for production bootstrap and staff recovery.",
    );
  }

  if (errors.length > 0) {
    throw new Error(
      [
        `[env] Refusing production start — missing/invalid environment:`,
        ...errors.map((e) => `- ${e}`),
        "",
        "رفع فوری در پنل → Environment Variables:",
        "  AUTH_SECRET=<حداقل ۳۲ کاراکتر تصادفی>",
        "  SEED_ADMIN_PASSWORD=<حداقل ۸ کاراکتر>",
        "سپس Stop → Start.",
        "یا: node scripts/bootstrap-production-env.cjs",
      ].join("\n"),
    );
  }
}

/**
 * Throws a clear error in production when required secrets are missing/weak.
 * On Node hosts, auto-creates data/production.env once when secrets are absent.
 */
export function assertProductionEnv() {
  if (!isProductionRuntime()) return;

  try {
    const mod = requireFromCwd("./scripts/production-env.cjs") as {
      ensureProductionEnv: (opts?: { autoBootstrap?: boolean }) => unknown;
    };
    mod.ensureProductionEnv({ autoBootstrap: true });
    return;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: unknown }).code)
        : "";
    // Workers / packaged runtimes may not ship the helper script.
    if (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND") {
      assertInline();
      return;
    }
    throw error;
  }
}

export { DEV_FALLBACK_SECRET, SHOWCASE_FALLBACK_SECRET };
