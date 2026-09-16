import { and, count, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "@/server/db/client";
import { activityLog, properties, type PropertyRow } from "@/server/db/schema";
import { ensureSchema } from "@/server/db/migrate";
import { ApiError } from "@/server/http/response";
import type { z } from "zod";
import type { propertyCreateSchema, propertyQuerySchema, propertyUpdateSchema } from "@/server/validation/schemas";

let booted = false;

export async function bootDb() {
  if (booted) return getDb();
  await ensureSchema();
  booted = true;
  return getDb();
}

async function logActivity(input: {
  actorId?: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  detail?: unknown;
  ip?: string;
  requestId?: string;
}) {
  const db = await bootDb();
  await db.insert(activityLog).values({
    id: nanoid(),
    actorId: input.actorId,
    actorRole: input.actorRole,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    detailJson: JSON.stringify(input.detail ?? {}),
    ip: input.ip,
    requestId: input.requestId,
  });
}

function serializeProperty(row: PropertyRow) {
  return {
    ...row,
    features: JSON.parse(row.featuresJson || "[]") as string[],
    gallery: JSON.parse(row.galleryJson || "[]") as string[],
  };
}

export async function listProperties(
  query: z.infer<typeof propertyQuerySchema>,
  scope?: { agentId?: string; roles?: string[] },
) {
  const db = await bootDb();
  const filters = [eq(properties.softDeleted, false)];

  if (query.status) filters.push(eq(properties.status, query.status as PropertyRow["status"]));
  if (query.listingType)
    filters.push(eq(properties.listingType, query.listingType as PropertyRow["listingType"]));
  if (query.agentId) filters.push(eq(properties.agentId, query.agentId));
  if (scope?.agentId && scope.roles?.includes("agent") && !scope.roles.includes("admin")) {
    filters.push(eq(properties.agentId, scope.agentId));
  }
  if (query.minPrice != null) filters.push(gte(properties.price, query.minPrice));
  if (query.maxPrice != null) filters.push(lte(properties.price, query.maxPrice));
  if (query.featured != null) filters.push(eq(properties.isFeatured, query.featured));
  if (query.q) {
    const q = `%${query.q}%`;
    filters.push(
      or(
        like(properties.title, q),
        like(properties.location, q),
        like(properties.neighborhood, q),
        like(properties.code, q),
      )!,
    );
  }

  const where = and(...filters);
  const offset = (query.page - 1) * query.pageSize;

  const [rows, totalRow] = await Promise.all([
    db
      .select()
      .from(properties)
      .where(where)
      .orderBy(desc(properties.updatedAt))
      .limit(query.pageSize)
      .offset(offset),
    db.select({ value: count() }).from(properties).where(where),
  ]);

  return {
    items: rows.map(serializeProperty),
    page: query.page,
    pageSize: query.pageSize,
    total: totalRow[0]?.value ?? 0,
  };
}

export async function getProperty(id: string) {
  const db = await bootDb();
  const row = await db.query.properties.findFirst({
    where: and(eq(properties.id, id), eq(properties.softDeleted, false)),
  });
  if (!row) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  await db
    .update(properties)
    .set({ views: sql`${properties.views} + 1` })
    .where(eq(properties.id, id));
  return serializeProperty({ ...row, views: row.views + 1 });
}

export async function createProperty(
  input: z.infer<typeof propertyCreateSchema>,
  actor?: { id?: string; role?: string },
) {
  const db = await bootDb();
  const id = nanoid();
  const code = input.code || `PR-${Date.now().toString().slice(-6)}`;
  await db.insert(properties).values({
    id,
    code,
    title: input.title,
    location: input.location,
    neighborhood: input.neighborhood || input.location,
    description: input.description || "",
    price: input.price,
    listingType: input.listingType,
    category: input.category,
    status: input.status,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    areaSqm: input.areaSqm,
    featuresJson: JSON.stringify(input.features),
    imageUrl: input.imageUrl || "",
    galleryJson: JSON.stringify(input.gallery),
    agentId: input.agentId,
    isFeatured: input.isFeatured ?? false,
  });
  await logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.create",
    entityType: "property",
    entityId: id,
    detail: { title: input.title, code },
  });
  return getProperty(id);
}

export async function updateProperty(
  id: string,
  input: z.infer<typeof propertyUpdateSchema>,
  actor?: { id?: string; role?: string },
) {
  const db = await bootDb();
  const existing = await db.query.properties.findFirst({
    where: and(eq(properties.id, id), eq(properties.softDeleted, false)),
  });
  if (!existing) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  if (input.version != null && input.version !== existing.version) {
    throw new ApiError(409, "VERSION_CONFLICT", "نسخه ملک تغییر کرده است؛ دوباره تلاش کنید");
  }

  await db
    .update(properties)
    .set({
      title: input.title ?? existing.title,
      location: input.location ?? existing.location,
      neighborhood: input.neighborhood ?? existing.neighborhood,
      description: input.description ?? existing.description,
      price: input.price ?? existing.price,
      listingType: input.listingType ?? existing.listingType,
      category: input.category ?? existing.category,
      status: input.status ?? existing.status,
      bedrooms: input.bedrooms ?? existing.bedrooms,
      bathrooms: input.bathrooms ?? existing.bathrooms,
      areaSqm: input.areaSqm ?? existing.areaSqm,
      featuresJson:
        input.features != null ? JSON.stringify(input.features) : existing.featuresJson,
      imageUrl: input.imageUrl ?? existing.imageUrl,
      galleryJson: input.gallery != null ? JSON.stringify(input.gallery) : existing.galleryJson,
      agentId: input.agentId ?? existing.agentId,
      isFeatured: input.isFeatured ?? existing.isFeatured,
      version: existing.version + 1,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(properties.id, id));

  await logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.update",
    entityType: "property",
    entityId: id,
    detail: input,
  });
  return getProperty(id);
}

export async function deleteProperty(id: string, actor?: { id?: string; role?: string }) {
  const db = await bootDb();
  const existing = await db.query.properties.findFirst({ where: eq(properties.id, id) });
  if (!existing || existing.softDeleted) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  await db
    .update(properties)
    .set({ softDeleted: true, status: "archived", updatedAt: new Date().toISOString() })
    .where(eq(properties.id, id));
  await logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.delete",
    entityType: "property",
    entityId: id,
  });
  return { id, deleted: true };
}
