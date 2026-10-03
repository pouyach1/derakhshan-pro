import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const storePath = path.join(process.cwd(), ".tmp", "agency-e2e.json");

/**
 * E2E against local Next.js (not Cloudflare production).
 * Uses an isolated AGENCY_STORE_PATH so production JSON is never touched.
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
