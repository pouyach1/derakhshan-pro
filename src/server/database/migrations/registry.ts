/**
 * Migration registry — Phase A is intentionally empty.
 * No migration mutates data/agency.json until you approve Phase B.
 */

export type Migration = {
  id: string;
  title: string;
  /** Human description; Phase A migrations must be no-ops. */
  description: string;
  applied: false;
};

/** Ordered list of future migrations. Empty until Phase B is approved. */
export const MIGRATIONS: Migration[] = [];

export function listPendingMigrations() {
  return MIGRATIONS.filter((migration) => !migration.applied);
}
