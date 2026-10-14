/**
 * Edge-safe auth secret helpers (no node:crypto / node:fs).
 * Used by middleware → session so the Edge runtime can verify JWTs.
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
    normalized === SHOWCASE_FALLBACK_SECRET ||
    normalized.includes("showcase-jwt-fallback")
  );
}

export function readAuthSecretRaw() {
  return (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
}

export { DEV_FALLBACK_SECRET, SHOWCASE_FALLBACK_SECRET };
