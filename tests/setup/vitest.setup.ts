import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, afterAll } from "vitest";
import "@testing-library/jest-dom/vitest";

process.env.AUTH_SECRET =
  process.env.AUTH_SECRET || "vitest-auth-secret-derakhshan-pro-32chars";
process.env.SEED_ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD || "test-staff-password";
process.env.DEMO_OTP = process.env.DEMO_OTP || "1234";

const tempRoot = path.join(os.tmpdir(), `derakhshan-vitest-${process.pid}`);
fs.mkdirSync(tempRoot, { recursive: true });
process.env.AGENCY_STORE_PATH = path.join(tempRoot, "agency.json");

afterAll(() => {
  try {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
});

beforeEach(() => {
  // Individual suites call resetTestStore() with fixtures.
});
