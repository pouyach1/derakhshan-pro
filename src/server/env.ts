/**
 * Production environment guards shared by Node startup and runtime auth/bootstrap.
 * Cloudflare/OpenNext production must also set these secrets — demo fallbacks are disabled.
 */

const DEV_FALLBACK_SECRET = "dev-only-change-me-derakhshan-agency-secret-key-32b";
const SHOWCASE_FALLBACK_SECRET =
  "derakhshan-showcase-jwt-fallback-v1-replace-with-AUTH_SECRET-in-real-deploys";

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

/**
 * Throws a clear error in production when required secrets are missing/weak.
 * Safe to call from server.cjs (via duplicated checks) and Next instrumentation.
 */
export function assertProductionEnv() {
  if (!isProductionRuntime()) return;

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
      `[env] Refusing production start — missing/invalid environment:\n- ${errors.join("\n- ")}`,
    );
  }
}

export { DEV_FALLBACK_SECRET, SHOWCASE_FALLBACK_SECRET };
