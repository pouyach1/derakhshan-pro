import { execSync } from "node:child_process";
import path from "node:path";

export default async function globalSetup() {
  const storePath = path.join(process.cwd(), ".tmp", "agency-e2e.json");
  process.env.AGENCY_STORE_PATH = storePath;
  process.env.AUTH_SECRET =
    process.env.AUTH_SECRET || "vitest-auth-secret-derakhshan-pro-32chars";
  process.env.SEED_ADMIN_PASSWORD =
    process.env.SEED_ADMIN_PASSWORD || "test-staff-password";
  process.env.DEMO_OTP = process.env.DEMO_OTP || "1234";

  execSync("npx tsx e2e/seed.ts", {
    stdio: "inherit",
    env: { ...process.env },
    cwd: process.cwd(),
  });
}
