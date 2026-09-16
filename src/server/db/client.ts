import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

export type AppDatabase = LibSQLDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __agencyDb?: AppDatabase;
  __agencyClient?: Client;
};

function resolveDbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "agency.db");
  return `file:${file}`;
}

export function getDbClient() {
  if (!globalForDb.__agencyClient) {
    globalForDb.__agencyClient = createClient({
      url: resolveDbUrl(),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  return globalForDb.__agencyClient;
}

export function getDb(): AppDatabase {
  if (!globalForDb.__agencyDb) {
    globalForDb.__agencyDb = drizzle(getDbClient(), { schema });
  }
  return globalForDb.__agencyDb;
}

export { schema };
