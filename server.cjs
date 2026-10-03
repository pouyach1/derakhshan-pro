/**
 * cPanel / Passenger / Parspack startup entry for the Node.js path.
 *
 * Startup file MUST be this file (`server.cjs`).
 * Do NOT point the host at a Playwright scraper or any other root script.
 *
 * Usage: node server.cjs
 * PORT is provided by the host (cPanel / Parspack Node.js App).
 *
 * Bind address: use HOST / LISTEN_HOST / BIND_HOST — never HOSTNAME.
 * On Linux, HOSTNAME is the machine name; binding there makes the reverse
 * proxy return opaque 400s after a successful build.
 */

const { createServer } = require("node:http");
const { parse } = require("node:url");
const path = require("node:path");
const fs = require("node:fs");

const ROOT = __dirname;
const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const HOST =
  process.env.HOST ||
  process.env.LISTEN_HOST ||
  process.env.BIND_HOST ||
  "0.0.0.0";

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
    console.error(
      "[server.cjs] Hint: after a 100% build, panel 'Unexpected server response: 400' usually means the process exited here or never bound 0.0.0.0:PORT.",
    );
    process.exit(1);
  }
}

function ensureDataDir() {
  const dataDir = path.join(ROOT, "data");
  fs.mkdirSync(dataDir, { recursive: true });
}

function installProcessGuards() {
  process.on("uncaughtException", (error) => {
    console.error("[server.cjs] uncaughtException:", error);
    process.exit(1);
  });
  process.on("unhandledRejection", (reason) => {
    console.error("[server.cjs] unhandledRejection:", reason);
    process.exit(1);
  });
}

assertProductionEnv();
ensureDataDir();
installProcessGuards();

let next;
try {
  next = require("next");
} catch (error) {
  console.error(
    "[server.cjs] Cannot load 'next'. Run `npm ci` (or `npm ci --omit=dev`) in the Application root before Start.",
  );
  console.error(error);
  process.exit(1);
}

const app = next({
  dev: false,
  dir: ROOT,
  hostname: HOST,
  port: PORT,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.on("error", (error) => {
      console.error(
        `[server.cjs] Listen failed on ${HOST}:${PORT}:`,
        error && error.message ? error.message : error,
      );
      if (error && error.code === "EADDRINUSE") {
        console.error(
          "[server.cjs] Port already in use — stop the other Node app or let the host assign PORT.",
        );
      }
      process.exit(1);
    });

    server.listen(PORT, HOST, () => {
      console.log(`[server.cjs] Ready on http://${HOST}:${PORT}`);
      console.log(
        `[server.cjs] NODE_ENV=${process.env.NODE_ENV || "(unset)"} entry=server.cjs`,
      );
    });
  })
  .catch((error) => {
    console.error("[server.cjs] Failed to start Next.js:", error);
    process.exit(1);
  });
