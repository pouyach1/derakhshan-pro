/**
 * Production environment guards shared by Node startup and runtime auth/bootstrap.
 *
 * On Node / Parspack / cPanel: if AUTH_SECRET or SEED_ADMIN_PASSWORD are missing,
 * generate strong values in-process and persist to data/production.env when possible.
 * This must work during `next start` instrumentation without depending on an extra
 * script file on the host (hosts often run stale package.json with `next start`).
 */

import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

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

function parseEnvFile(contents: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

function applyEnvMap(map: Record<string, string>) {
  for (const [key, value] of Object.entries(map)) {
    if (process.env[key] != null && String(process.env[key]).length > 0) continue;
    process.env[key] = value;
  }
}

function loadEnvFilesFromDisk() {
  const root = process.cwd();
  const files = [
    path.join(root, ".env"),
    path.join(root, ".env.production"),
    path.join(root, ".env.local"),
    path.join(root, "data", "production.env"),
  ];
  for (const filePath of files) {
    try {
      if (!fs.existsSync(filePath)) continue;
      applyEnvMap(parseEnvFile(fs.readFileSync(filePath, "utf8")));
    } catch {
      // ignore unreadable files
    }
  }
}

function stableFallbackSecret(seed: string) {
  // Last-resort in-memory secret when disk is not writable. Deterministic per host cwd
  // so restarts do not invalidate all sessions immediately.
  return createHash("sha256")
    .update(`derakhshan-pro:${seed}:${process.cwd()}`)
    .digest("hex");
}

function bootstrapSecretsInline() {
  loadEnvFilesFromDisk();

  let authSecret = readAuthSecretRaw();
  let seed = (process.env.SEED_ADMIN_PASSWORD || "").trim();
  let authOk = Boolean(authSecret) && !isWeakAuthSecret(authSecret);
  let seedOk = seed.length >= 8;

  if (authOk && seedOk) return { bootstrapped: false as const };

  if (!authOk) authSecret = randomBytes(48).toString("hex");
  if (!seedOk) seed = randomBytes(9).toString("base64url");

  process.env.AUTH_SECRET = authSecret;
  process.env.SEED_ADMIN_PASSWORD = seed;

  let persistedTo = "";
  try {
    const dataDir = path.join(process.cwd(), "data");
    fs.mkdirSync(dataDir, { recursive: true });
    const filePath = path.join(dataDir, "production.env");
    const body = [
      "# Auto-generated on first production boot (src/server/env.ts).",
      "# Panel Environment Variables override these when set.",
      `AUTH_SECRET=${authSecret}`,
      `SEED_ADMIN_PASSWORD=${seed}`,
      "",
    ].join("\n");
    fs.writeFileSync(filePath, body, { encoding: "utf8", mode: 0o600 });
    try {
      fs.chmodSync(filePath, 0o600);
    } catch {
      // ignore
    }
    persistedTo = filePath;
  } catch (error) {
    // Disk not writable — keep in-memory values so Start still succeeds.
    console.warn(
      "[env] Could not persist data/production.env; using in-memory secrets for this process:",
      error instanceof Error ? error.message : error,
    );
  }

  console.warn("[env] =====================================================");
  console.warn("[env] Production secrets were missing — auto-created:");
  if (persistedTo) console.warn(`[env]   file: ${persistedTo}`);
  console.warn(`[env]   AUTH_SECRET: (generated, ${authSecret.length} chars)`);
  console.warn(`[env]   SEED_ADMIN_PASSWORD: ${seed}`);
  console.warn("[env] ورود ادمین: admin@vorqen.ir با همین SEED_ADMIN_PASSWORD");
  console.warn("[env] این رمز را ذخیره کنید.");
  console.warn("[env] =====================================================");

  return { bootstrapped: true as const, seed, persistedTo };
}

/**
 * Ensures production secrets exist. Never blocks Node/Parspack Start when we can
 * generate secrets (file or in-memory). Still throws on exotic runtimes with no crypto/fs
 * only if secrets remain unusable — should not happen on cPanel/Parspack.
 */
export function assertProductionEnv() {
  if (!isProductionRuntime()) return;

  try {
    bootstrapSecretsInline();
  } catch (error) {
    // Extremely defensive: still try deterministic in-memory secrets.
    console.warn(
      "[env] Inline bootstrap failed, applying deterministic fallback:",
      error instanceof Error ? error.message : error,
    );
    if (!readAuthSecretRaw() || isWeakAuthSecret(readAuthSecretRaw())) {
      process.env.AUTH_SECRET = stableFallbackSecret("auth");
    }
    if ((process.env.SEED_ADMIN_PASSWORD || "").trim().length < 8) {
      process.env.SEED_ADMIN_PASSWORD = stableFallbackSecret("seed").slice(0, 16);
    }
  }

  const authSecret = readAuthSecretRaw();
  const seed = (process.env.SEED_ADMIN_PASSWORD || "").trim();
  if (!authSecret || isWeakAuthSecret(authSecret) || seed.length < 8) {
    throw new Error(
      [
        "[env] Refusing production start — missing/invalid environment:",
        "- AUTH_SECRET must be a strong random value (min 32 characters).",
        "- SEED_ADMIN_PASSWORD must be set (min 8 characters).",
        "",
        "روی هاست Parspack کد را از main به‌روز کنید، بعد npm run build و Restart.",
        "یا در پنل Environment Variables همین دو کلید را ست کنید.",
      ].join("\n"),
    );
  }
}

export { DEV_FALLBACK_SECRET, SHOWCASE_FALLBACK_SECRET };
