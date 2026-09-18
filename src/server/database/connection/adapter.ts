/**
 * Database adapter contract.
 * Phase A implementation: JSON file / in-memory (existing Agency store).
 * Future implementations may swap to D1/SQLite/Postgres without changing route handlers.
 */

import type { AgencyStore } from "@/server/database/schema";

export type DatabaseAdapter = {
  readonly kind: "json" | "sqlite" | "d1" | "postgres";
  /** Load the full agency document (current single-tenant blob). */
  load(): AgencyStore;
  /** Persist the full agency document. */
  save(store?: AgencyStore): void;
  /** Replace the in-memory + disk document (used by seed). */
  reset(next: AgencyStore): void;
  nowIso(): string;
  newId(): string;
};
