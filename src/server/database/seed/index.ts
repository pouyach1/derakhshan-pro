/**
 * Seed entrypoints for the database layer.
 * Phase A: delegates to existing bootstrap builders — no data rewrite.
 */

export { buildSeedStore, ensureBootstrapped } from "@/server/db/bootstrap";

import { buildSeedStore } from "@/server/db/bootstrap";
import { getDatabaseAdapter } from "@/server/database/connection";

/** Seed via the active adapter (JSON today). */
export async function seedViaAdapter() {
  const adapter = getDatabaseAdapter();
  const next = await buildSeedStore();
  adapter.reset(next);
  return next;
}
