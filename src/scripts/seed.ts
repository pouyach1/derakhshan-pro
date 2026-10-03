/**
 * Seed luxury demo data into the Agency JSON store.
 * Run: SEED_ADMIN_PASSWORD='…' npm run db:seed
 *
 * Refuses to overwrite a non-empty store unless FORCE_SEED=1.
 */

import { buildSeedStore } from "../server/db/bootstrap";
import {
  getStore,
  isAgencyStoreEmpty,
  resetStore,
  unloadStoreForTests,
} from "../server/db/store";
import { siteConfig } from "../config/siteConfig";

async function main() {
  // Clear any warm in-memory copy so we evaluate the on-disk document.
  unloadStoreForTests();
  const existing = getStore();
  if (!isAgencyStoreEmpty(existing) && process.env.FORCE_SEED !== "1") {
    console.error(
      "✗ Refusing to seed: agency store already has data.\n" +
        "  Back up first, then re-run with FORCE_SEED=1 if you intentionally want a wipe.",
    );
    process.exit(2);
  }

  console.log("→ seeding agency store…");
  const store = await buildSeedStore();
  resetStore(store);
  console.log("✓ seed complete → data/agency.json (or AGENCY_STORE_PATH)");
  console.log(`  admin: ${siteConfig.panels.demoAdminEmail}`);
  console.log(`  agent: ${siteConfig.panels.demoAgentEmail}`);
  console.log("  password: value from SEED_ADMIN_PASSWORD (not printed)");
  if (process.env.DEMO_OTP) {
    console.log("  client OTP: configured via DEMO_OTP");
  } else {
    console.log("  client OTP: not configured (set DEMO_OTP for demo client login)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
