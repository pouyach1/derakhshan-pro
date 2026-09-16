import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import path from "node:path";
import fs from "node:fs";

/** Apply schema with CREATE TABLE IF NOT EXISTS for zero-friction local boot */
export async function ensureSchema(client = createBootClient()) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT NOT NULL UNIQUE,
      email TEXT UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'client',
      password_hash TEXT,
      agent_id TEXT,
      onboarding_complete INTEGER NOT NULL DEFAULT 0,
      client_profile_json TEXT,
      avatar_url TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      neighborhood TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'IRR',
      listing_type TEXT NOT NULL DEFAULT 'sale',
      category TEXT NOT NULL DEFAULT 'residential',
      status TEXT NOT NULL DEFAULT 'draft',
      bedrooms INTEGER NOT NULL DEFAULT 0,
      bathrooms INTEGER NOT NULL DEFAULT 0,
      area_sqm REAL NOT NULL DEFAULT 0,
      features_json TEXT NOT NULL DEFAULT '[]',
      image_url TEXT NOT NULL DEFAULT '',
      gallery_json TEXT NOT NULL DEFAULT '[]',
      agent_id TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      soft_deleted INTEGER NOT NULL DEFAULT 0,
      version INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      property_id TEXT,
      property_title TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'manual',
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT NOT NULL DEFAULT '',
      assigned_agent_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      preferred_neighborhood TEXT NOT NULL DEFAULT '',
      budget_min INTEGER NOT NULL DEFAULT 0,
      budget_max INTEGER NOT NULL DEFAULT 0,
      urgency TEXT NOT NULL DEFAULT 'medium',
      intent TEXT NOT NULL DEFAULT 'buy',
      notes_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS tours (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_phone TEXT,
      scheduled_at TEXT NOT NULL,
      day_label TEXT NOT NULL DEFAULT '',
      time_label TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'upcoming',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      interest TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      message TEXT NOT NULL DEFAULT '',
      budget TEXT,
      tab TEXT NOT NULL DEFAULT 'vip',
      status TEXT NOT NULL DEFAULT 'new',
      meta_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_role TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      detail_json TEXT NOT NULL DEFAULT '{}',
      ip TEXT,
      request_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ];

  for (const sql of statements) {
    await client.execute(sql);
  }

  return drizzle(client, { schema });
}

function createBootClient() {
  if (process.env.DATABASE_URL) {
    return createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
  }
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return createClient({ url: `file:${path.join(dir, "agency.db")}` });
}
