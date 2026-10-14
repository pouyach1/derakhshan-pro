/**
 * Production environment guards shared by Node startup and runtime auth/bootstrap.
 *
 * Prefer platform Environment Variables (Render / Parspack panel).
 * Optional disk file: data/production.env — only when the host disk is durable.
 * Never logs secret values. Never invents in-memory random secrets that rotate
 * on every restart.
 */

import { createHash, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  DEV_FALLBACK_SECRET,
  SHOWCASE_FALLBACK_SECRET,
  isProductionRuntime,
  isWeakAuthSecret,
  readAuthSecretRaw,
} from "@/server/auth/secrets";

export {
  DEV_FALLBACK_SECRET,
  SHOWCASE_FALLBACK_SECRET,
  isProductionRuntime,
  isWeakAuthSecret,
  readAuthSecretRaw,
};

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

function mustUsePlatformSecrets() {
  if (process.env.ALLOW_SECRET_AUTOBOOTSTRAP === "1") return false;
  if (process.env.ALLOW_SECRET_AUTOBOOTSTRAP === "0") return true;
  return (
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER_SERVICE_ID) ||
    Boolean(process.env.RENDER_INSTANCE_ID) ||
    process.env.FLY_APP_NAME != null ||
    process.env.RAILWAY_ENVIRONMENT != null
  );
}

function writeProductionEnvFile(authSecret: string, seed: string) {
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
  const verify = parseEnvFile(fs.readFileSync(filePath, "utf8"));
  if (verify.AUTH_SECRET !== authSecret || verify.SEED_ADMIN_PASSWORD !== seed) {
    throw new Error("production.env write verification failed");
  }
  return filePath;
}

function bootstrapSecretsInline() {
  loadEnvFilesFromDisk();

  let authSecret = readAuthSecretRaw();
  let seed = (process.env.SEED_ADMIN_PASSWORD || "").trim();
  let authOk = Boolean(authSecret) && !isWeakAuthSecret(authSecret);
  let seedOk = seed.length >= 8;

  if (authOk && seedOk) return { bootstrapped: false as const };

  if (mustUsePlatformSecrets()) {
    throw new Error(
      [
        "[env] Auto-bootstrap disabled on this host — set AUTH_SECRET and SEED_ADMIN_PASSWORD",
        "in the platform Environment Variables (required on Render).",
      ].join("\n"),
    );
  }

  if (!authOk) authSecret = randomBytes(48).toString("hex");
  if (!seedOk) seed = randomBytes(9).toString("base64url");

  // Persist first — never keep random in-memory-only secrets (they rotate each restart).
  const persistedTo = writeProductionEnvFile(authSecret, seed);
  process.env.AUTH_SECRET = authSecret;
  process.env.SEED_ADMIN_PASSWORD = seed;

  console.warn("[env] Missing production secrets — wrote data/production.env once.");
  console.warn("[env] Secret values are not logged. Prefer host Environment Variables.");

  return { bootstrapped: true as const, persistedTo };
}

/**
 * Ensures production secrets exist. Does not print secret values.
 * On Render / ephemeral hosts: requires platform env vars (no random rotation).
 */
export function assertProductionEnv() {
  if (!isProductionRuntime()) return;

  try {
    bootstrapSecretsInline();
  } catch (error) {
    // Do not invent rotating in-memory secrets here.
    console.warn(
      "[env] Secret bootstrap/load failed:",
      error instanceof Error ? error.message : error,
    );
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
        "Set both in host Environment Variables, then Restart.",
      ].join("\n"),
    );
  }
}

/** Deterministic helper kept for tests / exotic tooling — not used for rotating prod auth. */
export function stableFallbackSecret(seed: string) {
  return createHash("sha256")
    .update(`derakhshan-pro:${seed}:${process.cwd()}`)
    .digest("hex");
}
