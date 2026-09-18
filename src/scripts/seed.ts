/**
 * Seed luxury demo data into the Agency JSON store.
 * Run: SEED_ADMIN_PASSWORD='…' npm run db:seed
 */

import { buildSeedStore } from "../server/db/bootstrap";
import { resetStore } from "../server/db/store";
import { siteConfig } from "../config/siteConfig";

async function main() {
  console.log("→ seeding agency store…");
  const store = await buildSeedStore();
  resetStore(store);
  console.log("✓ seed complete → data/agency.json");
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
