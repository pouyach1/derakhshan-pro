/**
 * Seed luxury demo data into the Agency JSON store.
 * Run: npm run db:seed
 */

import { buildSeedStore } from "../server/db/bootstrap";
import { resetStore } from "../server/db/store";
import { siteConfig } from "../config/siteConfig";

async function main() {
  console.log("→ seeding agency store…");
  const store = await buildSeedStore();
  resetStore(store);
  console.log("✓ seed complete → data/agency.json");
  console.log(`  admin: ${siteConfig.panels.demoAdminEmail} / 123456`);
  console.log(`  agent: ${siteConfig.panels.demoAgentEmail} / 123456`);
  console.log(`  client OTP: ${process.env.DEMO_OTP || "1234"}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
