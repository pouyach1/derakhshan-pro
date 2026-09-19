/**
 * cPanel / Passenger startup entry for the Node.js path.
 * Do NOT use the repo-root index.js (Playwright scraper) as the startup file.
 *
 * Usage: node server.cjs
 * PORT is provided by the host (cPanel Node.js App).
 */

const { createServer } = require("node:http");
const { parse } = require("node:url");
const path = require("node:path");
const fs = require("node:fs");

const ROOT = __dirname;
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

function isWeakSecret(secret) {
  const normalized = String(secret || "")
    .trim()
    .toLowerCase();
  return (
    !secret ||
    secret.trim().length < 32 ||
    normalized.startsWith("change-me") ||
    normalized.includes("replace-with")
  );
}

function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const errors = [];
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
  if (isWeakSecret(authSecret)) {
    errors.push(
      "AUTH_SECRET must be set to a strong random value (min 32 characters). Do not use change-me / replace-with placeholders.",
    );
  }

  const seed = (process.env.SEED_ADMIN_PASSWORD || "").trim();
  if (seed.length < 8) {
    errors.push(
      "SEED_ADMIN_PASSWORD must be set (min 8 characters) for production bootstrap and staff recovery.",
    );
  }

  if (errors.length > 0) {
    console.error("[server.cjs] Refusing to start — missing/invalid production environment:");
    for (const message of errors) {
      console.error(`  - ${message}`);
    }
    process.exit(1);
  }
}

function ensureDataDir() {
  const dataDir = path.join(ROOT, "data");
  fs.mkdirSync(dataDir, { recursive: true });
}

assertProductionEnv();
ensureDataDir();

const next = require("next");
const app = next({
  dev: false,
  dir: ROOT,
  hostname: HOSTNAME,
  port: PORT,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(PORT, HOSTNAME, () => {
      console.log(`[server.cjs] Ready on http://${HOSTNAME}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("[server.cjs] Failed to start Next.js:", error);
    process.exit(1);
  });
