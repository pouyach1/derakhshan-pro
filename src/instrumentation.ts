/**
 * Next.js instrumentation — validates production secrets before serving traffic.
 *
 * IMPORTANT: This file must stay free of node:fs / node:crypto imports and free of
 * secondary modules that pull those APIs. Next compiles a separate Edge copy of
 * instrumentation; Node-only files must not be dynamically imported with
 * webpackIgnore (that leaves a dangling `.next/server/instrumentation.node`
 * import and crashes Render/Node startup with ERR_MODULE_NOT_FOUND).
 *
 * File bootstrap / loading of data/production.env happens earlier in
 * server.cjs → scripts/production-env.cjs before `next.prepare()`.
 */

function isWeakAuthSecret(secret: string) {
  const normalized = secret.trim().toLowerCase();
  return (
    secret.trim().length < 32 ||
    normalized.startsWith("change-me") ||
    normalized.includes("replace-with") ||
    normalized.includes("showcase-jwt-fallback") ||
    normalized === "dev-only-change-me-derakhshan-agency-secret-key-32b"
  );
}

export async function register() {
  // Edge runtime: nothing to do (no Node APIs here).
  if (process.env.NEXT_RUNTIME === "edge") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.NODE_ENV !== "production") return;

  const authSecret = (process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
  const seed = (process.env.SEED_ADMIN_PASSWORD || "").trim();

  if (!authSecret || isWeakAuthSecret(authSecret) || seed.length < 8) {
    throw new Error(
      [
        "[instrumentation] Refusing production start — missing/invalid environment:",
        "- AUTH_SECRET must be a strong random value (min 32 characters).",
        "- SEED_ADMIN_PASSWORD must be set (min 8 characters).",
        "",
        "Set both in the host Environment Variables (Render / Parspack / cPanel), then Restart.",
      ].join("\n"),
    );
  }
}
