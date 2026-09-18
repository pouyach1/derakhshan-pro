/**
 * Edge-safe persistence for Agency API.
 * - Node: JSON file at data/agency.json (survives restarts)
 * - Workers/CF: in-memory isolate store
 */

import { nanoid } from "nanoid";
import type { ClientProfile, UserRole } from "@/lib/auth";

export type PropertyStatus = "draft" | "published" | "negotiation" | "sold" | "archived";
export type ListingType = "sale" | "rent";
export type LeadStatus = "new" | "contacted" | "viewing" | "negotiation" | "closed" | "lost";
export type TourStatus = "upcoming" | "completed" | "canceled";

export type UserRecord = {
  id: string;
  phone: string;
  email: string | null;
  name: string;
  role: UserRole;
  passwordHash: string | null;
  agentId: string | null;
  onboardingComplete: boolean;
  clientProfile: ClientProfile | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PropertyRecord = {
  id: string;
  code: string;
  title: string;
  location: string;
  neighborhood: string;
  description: string;
  price: number;
  currency: string;
  listingType: ListingType;
  category: string;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  features: string[];
  imageUrl: string;
  gallery: string[];
  agentId: string | null;
  views: number;
  isFeatured: boolean;
  softDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type LeadRecord = {
  id: string;
  clientName: string;
  phone: string;
  email: string | null;
  propertyId: string | null;
  propertyTitle: string;
  source: string;
  status: LeadStatus;
  notes: string;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientRecord = {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  email: string | null;
  preferredNeighborhood: string;
  budgetMin: number;
  budgetMax: number;
  urgency: "low" | "medium" | "high";
  intent: "buy" | "rent" | "invest";
  notes: Array<{ id?: string; text: string; at?: string }>;
  createdAt: string;
  updatedAt: string;
};

export type TourRecord = {
  id: string;
  agentId: string;
  propertyId: string;
  clientName: string;
  clientPhone: string | null;
  scheduledAt: string;
  dayLabel: string;
  timeLabel: string;
  status: TourStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ContactRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  category: string;
  message: string;
  budget: string | null;
  tab: string;
  status: "new" | "read" | "archived";
  meta: Record<string, unknown>;
  createdAt: string;
};

export type ActivityRecord = {
  id: string;
  actorId: string | null;
  actorRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  detail: Record<string, unknown>;
  ip: string | null;
  requestId: string | null;
  createdAt: string;
};

export type AgencySettings = {
  managerNameFa: string;
  notifyEmail: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  phone: string;
  address: string;
  publicDomain: string;
};

export type AgencyStore = {
  users: UserRecord[];
  properties: PropertyRecord[];
  leads: LeadRecord[];
  clients: ClientRecord[];
  tours: TourRecord[];
  contacts: ContactRecord[];
  activity: ActivityRecord[];
  settings?: AgencySettings;
};

function emptyStore(): AgencyStore {
  return {
    users: [],
    properties: [],
    leads: [],
    clients: [],
    tours: [],
    contacts: [],
    activity: [],
    settings: undefined,
  };
}

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
    globalForStore.__agencyStore = readFromDisk() ?? emptyStore();
    globalForStore.__agencyStoreLoaded = true;
  }
  return globalForStore.__agencyStore!;
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
  globalForStore.__agencyStore = next;
  globalForStore.__agencyStoreLoaded = true;
  saveStore();
}
