/**
 * Seeds an isolated AgencyStore for Playwright E2E.
 * Invoked via `npx tsx e2e/seed.ts` from globalSetup.
 */
import fs from "node:fs";
import path from "node:path";

process.env.AUTH_SECRET =
  process.env.AUTH_SECRET || "vitest-auth-secret-derakhshan-pro-32chars";
process.env.SEED_ADMIN_PASSWORD =
  process.env.SEED_ADMIN_PASSWORD || "test-staff-password";
process.env.DEMO_OTP = process.env.DEMO_OTP || "1234";

const storePath =
  process.env.AGENCY_STORE_PATH || path.join(process.cwd(), ".tmp", "agency-e2e.json");
process.env.AGENCY_STORE_PATH = storePath;

async function main() {
  const { buildIsolationFixture } = await import("../tests/helpers/store");
  const fixture = await buildIsolationFixture();
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  // buildIsolationFixture already wrote via resetStore; ensure file exists.
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(fixture.store, null, 2));
  }
  const meta = {
    storePath,
    admin: { id: fixture.admin.id, phone: fixture.admin.phone, email: fixture.admin.email },
    agentA: {
      id: fixture.agentA.id,
      phone: fixture.agentA.phone,
      email: fixture.agentA.email,
      agentId: fixture.agentA.agentId,
      name: fixture.agentA.name,
    },
    agentB: {
      id: fixture.agentB.id,
      phone: fixture.agentB.phone,
      email: fixture.agentB.email,
      agentId: fixture.agentB.agentId,
      name: fixture.agentB.name,
    },
    clientA: { id: fixture.clientA.id, phone: fixture.clientA.phone, name: fixture.clientA.name },
    clientB: { id: fixture.clientB.id, phone: fixture.clientB.phone, name: fixture.clientB.name },
    propertyA: { id: fixture.propertyA.id, title: fixture.propertyA.title },
    propertyB: { id: fixture.propertyB.id, title: fixture.propertyB.title },
    clientRecordA: { id: fixture.clientRecordA.id, name: fixture.clientRecordA.name },
    blogA: { id: fixture.blogA.id, slug: fixture.blogA.slug },
    draftBlog: { id: fixture.draftBlog.id, slug: fixture.draftBlog.slug },
    password: "test-staff-password",
  };
  fs.writeFileSync(path.join(path.dirname(storePath), "e2e-meta.json"), JSON.stringify(meta, null, 2));
  console.log(`[e2e:seed] wrote ${storePath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
