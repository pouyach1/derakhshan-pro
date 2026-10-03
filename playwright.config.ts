import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const storePath = path.join(process.cwd(), ".tmp", "agency-e2e.json");

const chromiumCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  path.join(
    process.env.PLAYWRIGHT_BROWSERS_PATH ||
      path.join(process.env.HOME || "", ".cache/ms-playwright"),
    "chromium-1169/chrome-linux/chrome",
  ),
].filter(Boolean) as string[];

const chromiumExecutable = chromiumCandidates.find((candidate) => fs.existsSync(candidate));

/**
 * E2E against local Next.js (not Cloudflare production).
 * Uses an isolated AGENCY_STORE_PATH so production JSON is never touched.
 *
 * Prefer the full Chromium build when headless_shell is unavailable (common in
 * constrained CI disks). Playwright 1.52 defaults to chromium-headless-shell.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3010",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
    ...(chromiumExecutable
      ? {
          launchOptions: {
            executablePath: chromiumExecutable,
            args: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
          },
        }
      : {}),
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx next dev -H 127.0.0.1 -p 3010",
    url: "http://127.0.0.1:3010/login",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ...process.env,
      AUTH_SECRET: process.env.AUTH_SECRET || "vitest-auth-secret-derakhshan-pro-32chars",
      SEED_ADMIN_PASSWORD: process.env.SEED_ADMIN_PASSWORD || "test-staff-password",
      DEMO_OTP: process.env.DEMO_OTP || "1234",
      AGENCY_STORE_PATH: process.env.AGENCY_STORE_PATH || storePath,
    },
  },
});
