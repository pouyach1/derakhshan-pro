import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { emptyAgencyStore } from "@/server/database/schema";
import {
  getPersistenceDiagnostics,
  getStore,
  isAgencyStoreEmpty,
  PersistenceError,
  resetStore,
  saveStore,
  unloadStoreForTests,
} from "@/server/db/store";
import { ensureBootstrapped } from "@/server/db/bootstrap";

const suiteRoot = path.join(os.tmpdir(), `derakhshan-persist-${process.pid}-${Date.now()}`);
const originalStorePath = process.env.AGENCY_STORE_PATH;

function setStorePath(file: string) {
  process.env.AGENCY_STORE_PATH = file;
  unloadStoreForTests();
}

beforeEach(() => {
  fs.mkdirSync(suiteRoot, { recursive: true });
});

afterEach(() => {
  unloadStoreForTests();
  if (originalStorePath) process.env.AGENCY_STORE_PATH = originalStorePath;
  else delete process.env.AGENCY_STORE_PATH;
  try {
    fs.rmSync(suiteRoot, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
});

describe("Agency JSON persistence reliability", () => {
  it("atomically persists schemaVersion and reloads after unload", () => {
    const file = path.join(suiteRoot, "agency.json");
    setStorePath(file);

    const store = emptyAgencyStore();
    store.users.push({
      id: "u1",
      phone: "09120000000",
      email: null,
      name: "تست",
      role: "admin",
      passwordHash: "x",
      agentId: null,
      onboardingComplete: true,
      clientProfile: null,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    resetStore(store);

    expect(fs.existsSync(file)).toBe(true);
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as { schemaVersion?: number };
    expect(raw.schemaVersion).toBe(1);
    expect(fs.readdirSync(suiteRoot).some((n) => n.endsWith(".tmp"))).toBe(false);

    unloadStoreForTests();
    const reloaded = getStore();
    expect(reloaded.users).toHaveLength(1);
    expect(reloaded.schemaVersion).toBe(1);
    expect(getPersistenceDiagnostics().mode).toBe("json-file");
    expect(getPersistenceDiagnostics().lastWriteOk).toBe(true);
  });

  it("refuses to load corrupt JSON and does not overwrite the file with seed", async () => {
    const file = path.join(suiteRoot, "corrupt.json");
    fs.writeFileSync(file, "{not-json", "utf8");
    setStorePath(file);

    expect(() => getStore()).toThrow(PersistenceError);
    try {
      getStore();
    } catch (error) {
      expect(error).toBeInstanceOf(PersistenceError);
      expect((error as PersistenceError).code).toBe("STORE_CORRUPT");
    }

    await expect(ensureBootstrapped()).rejects.toBeInstanceOf(PersistenceError);
    expect(fs.readFileSync(file, "utf8")).toBe("{not-json");
    expect(getPersistenceDiagnostics().corrupt).toBe(true);
  });

  it("treats empty file as corrupt (fail closed)", () => {
    const file = path.join(suiteRoot, "empty.json");
    fs.writeFileSync(file, "   \n", "utf8");
    setStorePath(file);
    expect(() => getStore()).toThrow(/corrupt/i);
  });

  it("does not wipe a partial store during ensureBootstrapped", async () => {
    const file = path.join(suiteRoot, "partial.json");
    setStorePath(file);

    const partial = emptyAgencyStore();
    partial.users.push({
      id: "keep-me",
      phone: "09129999999",
      email: "keep@test.local",
      name: "نگه دار",
      role: "client",
      passwordHash: null,
      agentId: null,
      onboardingComplete: true,
      clientProfile: null,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    resetStore(partial);

    await ensureBootstrapped();
    const live = getStore();
    expect(live.users.some((u) => u.id === "keep-me")).toBe(true);
    expect(isAgencyStoreEmpty(live)).toBe(false);
  });

  it("rotates a local backup when AGENCY_STORE_BACKUP=1", () => {
    const file = path.join(suiteRoot, "backed.json");
    setStorePath(file);
    process.env.AGENCY_STORE_BACKUP = "1";
    process.env.AGENCY_STORE_BACKUP_KEEP = "3";

    const first = emptyAgencyStore();
    first.activity.push({
      id: "a1",
      actorId: "system",
      actorRole: "admin",
      action: "test",
      entityType: "system",
      entityId: null,
      detail: {},
      ip: null,
      requestId: null,
      createdAt: new Date().toISOString(),
    });
    resetStore(first);

    const second = getStore();
    second.activity.push({
      id: "a2",
      actorId: "system",
      actorRole: "admin",
      action: "test-2",
      entityType: "system",
      entityId: null,
      detail: {},
      ip: null,
      requestId: null,
      createdAt: new Date().toISOString(),
    });
    saveStore();

    const backupDir = path.join(suiteRoot, "backups");
    expect(fs.existsSync(backupDir)).toBe(true);
    const backups = fs.readdirSync(backupDir).filter((n) => n.endsWith(".json"));
    expect(backups.length).toBeGreaterThanOrEqual(1);

    delete process.env.AGENCY_STORE_BACKUP;
    delete process.env.AGENCY_STORE_BACKUP_KEEP;
  });
});
