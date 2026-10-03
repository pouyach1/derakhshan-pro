/**
 * Edge-safe persistence for Agency API.
 * - Node: JSON file at data/agency.json (or AGENCY_STORE_PATH)
 * - Workers/CF: in-memory isolate store (NOT durable across cold starts)
 *
 * Node guarantees (single process):
 * - Atomic replace via temp file + rename (same directory)
 * - Write failures throw (callers must not report success)
 * - Corrupt JSON fails closed (does not reseed over a bad file)
 *
 * Not guaranteed:
 * - Multi-process / multi-instance concurrent writers
 * - Durable Cloudflare Workers storage (memory only today)
 */

import { nanoid } from "@/lib/id";
import {
  emptyAgencyStore,
  normalizeAgencyStore,
  AGENCY_SCHEMA_VERSION,
  type ActivityRecord,
  type AgencySettings,
  type AgencyStore,
  type BlogPostRecord,
  type BlogPostStatus,
  type ChatMessageRecord,
  type ChatThreadKind,
  type ChatThreadRecord,
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
  BlogPostRecord,
  BlogPostStatus,
  ChatMessageRecord,
  ChatThreadKind,
  ChatThreadRecord,
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

export class PersistenceError extends Error {
  code: string;
  constructor(code: string, message: string, cause?: unknown) {
    super(message);
    this.name = "PersistenceError";
    this.code = code;
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

const globalForStore = globalThis as unknown as {
  __agencyStore?: AgencyStore;
  __agencyStoreLoaded?: boolean;
  __agencyStoreCorrupt?: boolean;
  __agencyLastWriteOk?: boolean;
  __agencyLastWriteAt?: string;
  __agencyPersistenceMode?: "json-file" | "memory";
};

function isNodeRuntime() {
  return typeof process !== "undefined" && Boolean(process.versions?.node);
}

function storeFilePath(pathMod: typeof import("node:path")) {
  const override = process.env.AGENCY_STORE_PATH?.trim();
  if (override) return override;
  return pathMod.join(process.cwd(), "data", "agency.json");
}

function nodeFs() {
  // Dynamic access keeps Workers bundlers from hard-failing on missing fs.
  const fs = eval("require")("node:fs") as typeof import("node:fs");
  const path = eval("require")("node:path") as typeof import("node:path");
  return { fs, path };
}

type DiskRead =
  | { kind: "missing" }
  | { kind: "ok"; store: AgencyStore }
  | { kind: "corrupt"; error: unknown };

function readFromDisk(): DiskRead {
  if (!isNodeRuntime()) return { kind: "missing" };
  try {
    const { fs, path } = nodeFs();
    const file = storeFilePath(path);
    if (!fs.existsSync(file)) return { kind: "missing" };
    const raw = fs.readFileSync(file, "utf8");
    if (!raw.trim()) {
      return { kind: "corrupt", error: new Error("Agency store file is empty") };
    }
    const parsed = JSON.parse(raw) as AgencyStore;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { kind: "corrupt", error: new Error("Agency store root is not an object") };
    }
    return { kind: "ok", store: parsed };
  } catch (error) {
    return { kind: "corrupt", error };
  }
}

function maybeRotateBackup(
  fs: typeof import("node:fs"),
  path: typeof import("node:path"),
  file: string,
) {
  const enabled = process.env.AGENCY_STORE_BACKUP?.trim();
  if (!enabled || enabled === "0" || enabled.toLowerCase() === "false") return;
  if (!fs.existsSync(file)) return;

  const keepRaw = Number(process.env.AGENCY_STORE_BACKUP_KEEP || "5");
  const keep = Number.isFinite(keepRaw) && keepRaw > 0 ? Math.min(keepRaw, 30) : 5;
  const backupDir = path.join(path.dirname(file), "backups");
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const target = path.join(backupDir, `agency-${stamp}.json`);
  fs.copyFileSync(file, target);

  const files = fs
    .readdirSync(backupDir)
    .filter((name) => name.startsWith("agency-") && name.endsWith(".json"))
    .map((name) => ({
      name,
      mtime: fs.statSync(path.join(backupDir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const stale of files.slice(keep)) {
    try {
      fs.unlinkSync(path.join(backupDir, stale.name));
    } catch {
      /* ignore cleanup failure */
    }
  }
}

/**
 * Atomic replace: write temp in the same directory, then rename over the target.
 * Same-directory rename is atomic on POSIX filesystems used by typical Node/cPanel hosts.
 */
function writeToDisk(store: AgencyStore) {
  if (!isNodeRuntime()) {
    globalForStore.__agencyPersistenceMode = "memory";
    globalForStore.__agencyLastWriteOk = true;
    globalForStore.__agencyLastWriteAt = nowIso();
    return;
  }

  const { fs, path } = nodeFs();
  const file = storeFilePath(path);
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  maybeRotateBackup(fs, path, file);

  const payload = JSON.stringify(store, null, 2);
  const tmp = path.join(dir, `.${path.basename(file)}.${process.pid}.${Date.now()}.tmp`);
  try {
    fs.writeFileSync(tmp, payload, { encoding: "utf8", mode: 0o600 });
    // Prefer rename for atomic replace. On rare Windows locks, fall back carefully.
    try {
      fs.renameSync(tmp, file);
    } catch (renameError) {
      fs.copyFileSync(tmp, file);
      fs.unlinkSync(tmp);
      if (process.env.NODE_ENV !== "production") {
        console.warn("[persistence] rename failed; used copy fallback", renameError);
      }
    }
    globalForStore.__agencyPersistenceMode = "json-file";
    globalForStore.__agencyLastWriteOk = true;
    globalForStore.__agencyLastWriteAt = nowIso();
  } catch (error) {
    try {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
    globalForStore.__agencyLastWriteOk = false;
    throw new PersistenceError(
      "WRITE_FAILED",
      "Failed to persist agency store",
      error,
    );
  }
}

function stampSchemaVersion(store: AgencyStore): AgencyStore {
  store.schemaVersion = AGENCY_SCHEMA_VERSION;
  return store;
}

export function getStore(): AgencyStore {
  if (globalForStore.__agencyStoreCorrupt) {
    throw new PersistenceError(
      "STORE_CORRUPT",
      "Agency store is corrupt and cannot be loaded safely",
    );
  }

  if (!globalForStore.__agencyStoreLoaded) {
    globalForStore.__agencyPersistenceMode = isNodeRuntime() ? "json-file" : "memory";
    const disk = readFromDisk();
    if (disk.kind === "corrupt") {
      globalForStore.__agencyStoreCorrupt = true;
      globalForStore.__agencyStoreLoaded = true;
      console.error("[persistence] corrupt agency store; refusing to load or reseed", disk.error);
      throw new PersistenceError(
        "STORE_CORRUPT",
        "Agency store file is corrupt; refusing to overwrite with seed data",
        disk.error,
      );
    }
    const base = disk.kind === "ok" ? disk.store : emptyAgencyStore();
    globalForStore.__agencyStore = stampSchemaVersion(normalizeAgencyStore(base));
    globalForStore.__agencyStoreLoaded = true;
    globalForStore.__agencyLastWriteOk = disk.kind === "ok" || disk.kind === "missing";
  }
  return stampSchemaVersion(normalizeAgencyStore(globalForStore.__agencyStore!));
}

export function saveStore() {
  const store = getStore();
  stampSchemaVersion(store);
  writeToDisk(store);
}

export function nowIso() {
  return new Date().toISOString();
}

export function newId() {
  return nanoid();
}

export function resetStore(next: AgencyStore) {
  globalForStore.__agencyStoreCorrupt = false;
  globalForStore.__agencyStore = stampSchemaVersion(normalizeAgencyStore(next));
  globalForStore.__agencyStoreLoaded = true;
  saveStore();
}

/** True when the document has no operational records (safe to first-boot seed). */
export function isAgencyStoreEmpty(store: AgencyStore): boolean {
  return (
    store.users.length === 0 &&
    store.properties.length === 0 &&
    store.leads.length === 0 &&
    store.clients.length === 0 &&
    store.tours.length === 0 &&
    store.contacts.length === 0 &&
    (store.deals?.length ?? 0) === 0 &&
    (store.blogPosts?.length ?? 0) === 0 &&
    (store.chatThreads?.length ?? 0) === 0 &&
    (store.chatMessages?.length ?? 0) === 0 &&
    store.activity.length === 0
  );
}

export type PersistenceDiagnostics = {
  mode: "json-file" | "memory";
  readable: boolean;
  writable: boolean | null;
  initialized: boolean;
  corrupt: boolean;
  schemaVersion: number | null;
  empty: boolean | null;
  lastWriteOk: boolean | null;
  lastWriteAt: string | null;
};

/**
 * Safe operator diagnostics — no filesystem paths, secrets, or record payloads.
 */
export function getPersistenceDiagnostics(): PersistenceDiagnostics {
  const mode =
    globalForStore.__agencyPersistenceMode ??
    (isNodeRuntime() ? "json-file" : "memory");

  if (globalForStore.__agencyStoreCorrupt) {
    return {
      mode,
      readable: false,
      writable: false,
      initialized: false,
      corrupt: true,
      schemaVersion: null,
      empty: null,
      lastWriteOk: false,
      lastWriteAt: globalForStore.__agencyLastWriteAt ?? null,
    };
  }

  try {
    const store = getStore();
    const writable =
      typeof globalForStore.__agencyLastWriteOk === "boolean"
        ? globalForStore.__agencyLastWriteOk
        : mode === "memory"
          ? true
          : null;
    return {
      mode,
      readable: true,
      writable,
      initialized: true,
      corrupt: false,
      schemaVersion: store.schemaVersion ?? AGENCY_SCHEMA_VERSION,
      empty: isAgencyStoreEmpty(store),
      lastWriteOk: globalForStore.__agencyLastWriteOk ?? null,
      lastWriteAt: globalForStore.__agencyLastWriteAt ?? null,
    };
  } catch (error) {
    if (error instanceof PersistenceError && error.code === "STORE_CORRUPT") {
      return {
        mode,
        readable: false,
        writable: false,
        initialized: false,
        corrupt: true,
        schemaVersion: null,
        empty: null,
        lastWriteOk: false,
        lastWriteAt: null,
      };
    }
    return {
      mode,
      readable: false,
      writable: false,
      initialized: false,
      corrupt: false,
      schemaVersion: null,
      empty: null,
      lastWriteOk: false,
      lastWriteAt: null,
    };
  }
}

/** Test helper — clears process-local store state without touching disk. */
export function unloadStoreForTests() {
  delete globalForStore.__agencyStore;
  delete globalForStore.__agencyStoreLoaded;
  delete globalForStore.__agencyStoreCorrupt;
  delete globalForStore.__agencyLastWriteOk;
  delete globalForStore.__agencyLastWriteAt;
  delete globalForStore.__agencyPersistenceMode;
}
