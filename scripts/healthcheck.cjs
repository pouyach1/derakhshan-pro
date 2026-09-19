#!/usr/bin/env node
/**
 * Production health check for Node / cPanel deployments.
 *
 * Usage:
 *   npm run healthcheck
 *   HEALTHCHECK_URL=https://vorqen.ir/api/health npm run healthcheck
 *   HEALTHCHECK_URL=http://127.0.0.1:3000/api/health node scripts/healthcheck.cjs
 */

const url = process.env.HEALTHCHECK_URL || "http://127.0.0.1:3000/api/health";

async function main() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const text = await response.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    const ok =
      response.ok &&
      (body?.data?.status === "healthy" ||
        body?.status === "healthy" ||
        (typeof body === "object" && JSON.stringify(body).includes("healthy")));

    console.log(`[healthcheck] ${response.status} ${url}`);
    console.log(typeof body === "string" ? body : JSON.stringify(body, null, 2));

    if (!ok) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`[healthcheck] FAILED ${url}`);
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    clearTimeout(timer);
  }
}

main();
