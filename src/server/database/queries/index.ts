/**
 * Read helpers over the active database adapter.
 * Phase A: thin pass-throughs — no filtering/behavior changes vs services.
 */

import { getDatabaseAdapter } from "@/server/database/connection";
import type {
  AgencySettings,
  AgencyStore,
  ClientRecord,
  LeadRecord,
  PropertyRecord,
  TourRecord,
  UserRecord,
} from "@/server/database/schema";

export function readStore(): AgencyStore {
  return getDatabaseAdapter().load();
}

export function listUsers(): UserRecord[] {
  return readStore().users;
}

export function listProperties(): PropertyRecord[] {
  return readStore().properties;
}

export function findPropertyById(id: string): PropertyRecord | undefined {
  return readStore().properties.find((row) => row.id === id && !row.softDeleted);
}

export function listLeads(): LeadRecord[] {
  return readStore().leads;
}

export function listClients(): ClientRecord[] {
  return readStore().clients;
}

export function listTours(): TourRecord[] {
  return readStore().tours;
}

export function readSettings(): AgencySettings | undefined {
  return readStore().settings;
}
