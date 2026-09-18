/**
 * Edge-safe persistence for Agency API.
 * - Node: JSON file at data/agency.json (survives restarts)
 * - Workers/CF: in-memory isolate store
 *
 * Phase A: record types live in `src/server/database/schema/*`.
 * This module keeps the physical JSON I/O + backward-compatible re-exports.
 */

import { nanoid } from "nanoid";
import {
  emptyAgencyStore,
  normalizeAgencyStore,
  type ActivityRecord,
  type AgencySettings,
  type AgencyStore,
  type ClientRecord,
  type ContactRecord,
  type DealRecord,
  type LeadRecord,
  type LeadStatus,
  type ListingType,
  type PropertyImageRecord,
  type PropertyRecord,
  type PropertyStatus,
  type TourRecord,
  type TourStatus,
  type UserRecord,
} from "@/server/database/schema";

export type {
  ActivityRecord,
  AgencySettings,
  AgencyStore,
  ClientRecord,
  ContactRecord,
  DealRecord,
  LeadRecord,
  LeadStatus,
  ListingType,
  PropertyImageRecord,
  PropertyRecord,
  PropertyStatus,
  TourRecord,
  TourStatus,
  UserRecord,
};

const globalForStore = globalThis as unknown as {
  __agencyStore?: AgencyStore;
  __agencyStoreLoaded?: boolean;
};

function isNodeRuntime() {
  return typeof process !== "undefined" && Boolean(process.versions?.node);
}

function readFromDisk(): AgencyStore | null {
  if (!isNodeRuntime()) return null;
  try {
    // Dynamic access keeps Workers bundlers from hard-failing on missing fs.
    const fs = eval("require")("node:fs") as typeof import("node:fs");
    const path = eval("require")("node:path") as typeof import("node:path");
    const file = path.join(process.cwd(), "data", "agency.json");
    if (!fs.existsSync(file)) return null;
    return JSON.parse(fs.readFileSync(file, "utf8")) as AgencyStore;
  } catch {
    return null;
  }
}

function writeToDisk(store: AgencyStore) {
  if (!isNodeRuntime()) return;
  try {
    const fs = eval("require")("node:fs") as typeof import("node:fs");
    const path = eval("require")("node:path") as typeof import("node:path");
    const file = path.join(process.cwd(), "data", "agency.json");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(store, null, 2));
  } catch {
    // ignore on edge
  }
}

export function getStore(): AgencyStore {
  if (!globalForStore.__agencyStoreLoaded) {
    globalForStore.__agencyStore = normalizeAgencyStore(readFromDisk() ?? emptyAgencyStore());
    globalForStore.__agencyStoreLoaded = true;
  }
  return normalizeAgencyStore(globalForStore.__agencyStore!);
}

export function saveStore() {
  writeToDisk(getStore());
}

export function nowIso() {
  return new Date().toISOString();
}

export function newId() {
  return nanoid();
}

export function resetStore(next: AgencyStore) {
  globalForStore.__agencyStore = normalizeAgencyStore(next);
  globalForStore.__agencyStoreLoaded = true;
  saveStore();
}
