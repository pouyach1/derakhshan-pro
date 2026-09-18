/**
 * JSON / in-memory adapter — wraps the existing edge-safe store.
 * Does not change file format or run migrations.
 */

import {
  getStore,
  newId,
  nowIso,
  resetStore,
  saveStore,
} from "@/server/db/store";
import type { AgencyStore } from "@/server/database/schema";
import type { DatabaseAdapter } from "./adapter";

export const jsonAgencyAdapter: DatabaseAdapter = {
  kind: "json",
  load() {
    return getStore();
  },
  save(store?: AgencyStore) {
    if (store) {
      resetStore(store);
      return;
    }
    saveStore();
  },
  reset(next: AgencyStore) {
    resetStore(next);
  },
  nowIso,
  newId,
};

/** Active adapter for this install. Swap here in later phases. */
export function getDatabaseAdapter(): DatabaseAdapter {
  return jsonAgencyAdapter;
}
