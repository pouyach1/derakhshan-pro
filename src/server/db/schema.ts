/**
 * ============================================================================
 * Drizzle schema — مدل دادهٔ بک‌اند املاک لوکس
 * ============================================================================
 * جداول: کاربران، املاک، لیدها، مشتریان CRM، بازدیدها، پیام‌های تماس، لاگ فعالیت
 */

import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    phone: text("phone").notNull().unique(),
    email: text("email").unique(),
    name: text("name").notNull(),
    role: text("role", { enum: ["admin", "agent", "client"] }).notNull().default("client"),
    passwordHash: text("password_hash"),
    agentId: text("agent_id"),
    onboardingComplete: integer("onboarding_complete", { mode: "boolean" }).notNull().default(false),
    clientProfileJson: text("client_profile_json"),
    avatarUrl: text("avatar_url"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    roleIdx: index("users_role_idx").on(t.role),
    agentIdx: index("users_agent_idx").on(t.agentId),
  }),
);

export const properties = sqliteTable(
  "properties",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    title: text("title").notNull(),
    location: text("location").notNull(),
    neighborhood: text("neighborhood").notNull().default(""),
    description: text("description").notNull().default(""),
    price: integer("price").notNull(),
    currency: text("currency").notNull().default("IRR"),
    listingType: text("listing_type", { enum: ["sale", "rent"] }).notNull().default("sale"),
    category: text("category").notNull().default("residential"),
    status: text("status", {
      enum: ["draft", "published", "negotiation", "sold", "archived"],
    })
      .notNull()
      .default("draft"),
    bedrooms: integer("bedrooms").notNull().default(0),
    bathrooms: integer("bathrooms").notNull().default(0),
    areaSqm: real("area_sqm").notNull().default(0),
    featuresJson: text("features_json").notNull().default("[]"),
    imageUrl: text("image_url").notNull().default(""),
    galleryJson: text("gallery_json").notNull().default("[]"),
    agentId: text("agent_id"),
    views: integer("views").notNull().default(0),
    isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
    softDeleted: integer("soft_deleted", { mode: "boolean" }).notNull().default(false),
    version: integer("version").notNull().default(1),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    statusIdx: index("properties_status_idx").on(t.status),
    agentIdx: index("properties_agent_idx").on(t.agentId),
    locationIdx: index("properties_location_idx").on(t.location),
    priceIdx: index("properties_price_idx").on(t.price),
  }),
);

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    clientName: text("client_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    propertyId: text("property_id"),
    propertyTitle: text("property_title").notNull().default(""),
    source: text("source").notNull().default("manual"),
    status: text("status", {
      enum: ["new", "contacted", "viewing", "negotiation", "closed", "lost"],
    })
      .notNull()
      .default("new"),
    notes: text("notes").notNull().default(""),
    assignedAgentId: text("assigned_agent_id"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    statusIdx: index("leads_status_idx").on(t.status),
    agentIdx: index("leads_agent_idx").on(t.assignedAgentId),
  }),
);

export const clients = sqliteTable(
  "clients",
  {
    id: text("id").primaryKey(),
    agentId: text("agent_id").notNull(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    preferredNeighborhood: text("preferred_neighborhood").notNull().default(""),
    budgetMin: integer("budget_min").notNull().default(0),
    budgetMax: integer("budget_max").notNull().default(0),
    urgency: text("urgency", { enum: ["low", "medium", "high"] })
      .notNull()
      .default("medium"),
    intent: text("intent", { enum: ["buy", "rent", "invest"] }).notNull().default("buy"),
    notesJson: text("notes_json").notNull().default("[]"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    agentIdx: index("clients_agent_idx").on(t.agentId),
  }),
);

export const tours = sqliteTable(
  "tours",
  {
    id: text("id").primaryKey(),
    agentId: text("agent_id").notNull(),
    propertyId: text("property_id").notNull(),
    clientName: text("client_name").notNull(),
    clientPhone: text("client_phone"),
    scheduledAt: text("scheduled_at").notNull(),
    dayLabel: text("day_label").notNull().default(""),
    timeLabel: text("time_label").notNull().default(""),
    status: text("status", { enum: ["upcoming", "completed", "canceled"] })
      .notNull()
      .default("upcoming"),
    notes: text("notes").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
    updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    agentIdx: index("tours_agent_idx").on(t.agentId),
    whenIdx: index("tours_when_idx").on(t.scheduledAt),
  }),
);

export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    interest: text("interest").notNull().default(""),
    category: text("category").notNull().default("general"),
    message: text("message").notNull().default(""),
    budget: text("budget"),
    tab: text("tab").notNull().default("vip"),
    status: text("status", { enum: ["new", "read", "archived"] })
      .notNull()
      .default("new"),
    metaJson: text("meta_json").notNull().default("{}"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    statusIdx: index("contact_status_idx").on(t.status),
  }),
);

export const activityLog = sqliteTable(
  "activity_log",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id"),
    actorRole: text("actor_role"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    detailJson: text("detail_json").notNull().default("{}"),
    ip: text("ip"),
    requestId: text("request_id"),
    createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  },
  (t) => ({
    entityIdx: index("activity_entity_idx").on(t.entityType, t.entityId),
    actorIdx: index("activity_actor_idx").on(t.actorId),
  }),
);

export type UserRow = typeof users.$inferSelect;
export type PropertyRow = typeof properties.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
export type ClientRow = typeof clients.$inferSelect;
export type TourRow = typeof tours.$inferSelect;
export type ContactMessageRow = typeof contactMessages.$inferSelect;
