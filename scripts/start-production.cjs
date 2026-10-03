#!/usr/bin/env node
/**
 * Production start entry used by `npm start`.
 * Bootstraps secrets, then launches server.cjs (never bare `next start` alone).
 */
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs");

const root = path.join(__dirname, "..");
process.chdir(root);

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
console.log(`[start] derakhshan-pro@${pkg.version} entry=server.cjs`);

try {
  const { ensureProductionEnv } = require("./production-env.cjs");
  ensureProductionEnv({ autoBootstrap: true });
} catch (error) {
  console.warn(
    "[start] production-env helper failed; server.cjs / instrumentation will retry:",
    error && error.message ? error.message : error,
  );
}

const serverPath = path.join(root, "server.cjs");
if (!fs.existsSync(serverPath)) {
  console.error("[start] server.cjs missing — pull latest main onto the host.");
  process.exit(1);
}

const child = spawn(process.execPath, [serverPath], {
  stdio: "inherit",
  env: process.env,
  cwd: root,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code == null ? 1 : code);
});
