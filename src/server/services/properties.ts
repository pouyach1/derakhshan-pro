import type { z } from "zod";
import { ApiError } from "@/server/http/response";
import {
  getStore,
  newId,
  nowIso,
  saveStore,
  type PropertyRecord,
} from "@/server/db/store";
import type {
  propertyCreateSchema,
  propertyQuerySchema,
  propertyUpdateSchema,
} from "@/server/validation/schemas";
import { ensureBootstrapped } from "@/server/db/bootstrap";

export async function bootDb() {
  await ensureBootstrapped();
  return getStore();
}

function logActivity(input: {
  actorId?: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  detail?: unknown;
  ip?: string;
  requestId?: string;
}) {
  const store = getStore();
  store.activity.unshift({
    id: newId(),
    actorId: input.actorId ?? null,
    actorRole: input.actorRole ?? null,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    detail: (input.detail as Record<string, unknown>) ?? {},
    ip: input.ip ?? null,
    requestId: input.requestId ?? null,
    createdAt: nowIso(),
  });
  store.activity = store.activity.slice(0, 500);
  saveStore();
}

export async function listProperties(
  query: z.infer<typeof propertyQuerySchema>,
  scope?: { agentId?: string; roles?: string[] },
) {
  await ensureBootstrapped();
  const store = getStore();
  let rows = store.properties.filter((p) => !p.softDeleted);

  if (query.status) rows = rows.filter((p) => p.status === query.status);
  if (query.listingType) rows = rows.filter((p) => p.listingType === query.listingType);
  if (query.agentId) rows = rows.filter((p) => p.agentId === query.agentId);
  if (scope?.agentId && scope.roles?.includes("agent") && !scope.roles.includes("admin")) {
    rows = rows.filter((p) => p.agentId === scope.agentId);
  }
  if (query.minPrice != null) rows = rows.filter((p) => p.price >= query.minPrice!);
  if (query.maxPrice != null) rows = rows.filter((p) => p.price <= query.maxPrice!);
  if (query.featured != null) rows = rows.filter((p) => p.isFeatured === query.featured);
  if (query.q) {
    const q = query.q.toLowerCase();
    rows = rows.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q),
    );
  }

  rows = rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  const items = rows.slice(start, start + query.pageSize);

  return { items, page: query.page, pageSize: query.pageSize, total };
}

export async function getProperty(id: string, opts?: { countView?: boolean }) {
  await ensureBootstrapped();
  const store = getStore();
  const row = store.properties.find((p) => p.id === id && !p.softDeleted);
  if (!row) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  if (opts?.countView) {
    row.views += 1;
    saveStore();
  }
  return row;
}

export async function createProperty(
  input: z.infer<typeof propertyCreateSchema>,
  actor?: { id?: string; role?: string },
) {
  await ensureBootstrapped();
  const store = getStore();
  const id = newId();
  const code = input.code || `PR-${Date.now().toString().slice(-6)}`;
  const row: PropertyRecord = {
    id,
    code,
    title: input.title,
    location: input.location,
    neighborhood: input.neighborhood || input.location,
    description: input.description || "",
    price: input.price,
    currency: "IRR",
    listingType: input.listingType,
    category: input.category,
    status: input.status,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    areaSqm: input.areaSqm,
    features: input.features,
    imageUrl: input.imageUrl || "/images/landing/hero/banner.jpg",
    gallery: input.gallery.length ? input.gallery : [input.imageUrl || "/images/landing/hero/banner.jpg"],
    agentId: input.agentId ?? null,
    views: 0,
    isFeatured: input.isFeatured ?? false,
    softDeleted: false,
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.properties.unshift(row);
  saveStore();
  logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.create",
    entityType: "property",
    entityId: id,
    detail: { title: input.title, code },
  });
  return row;
}

export async function updateProperty(
  id: string,
  input: z.infer<typeof propertyUpdateSchema>,
  actor?: { id?: string; role?: string },
) {
  const store = getStore();
  const existing = store.properties.find((p) => p.id === id && !p.softDeleted);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  if (input.version != null && input.version !== existing.version) {
    throw new ApiError(409, "VERSION_CONFLICT", "نسخه ملک تغییر کرده است؛ دوباره تلاش کنید");
  }

  Object.assign(existing, {
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
    features: input.features ?? existing.features,
    imageUrl: input.imageUrl ?? existing.imageUrl,
    gallery: input.gallery ?? existing.gallery,
    agentId: input.agentId ?? existing.agentId,
    isFeatured: input.isFeatured ?? existing.isFeatured,
    version: existing.version + 1,
    updatedAt: nowIso(),
  });
  saveStore();
  logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.update",
    entityType: "property",
    entityId: id,
    detail: input,
  });
  return existing;
}

export async function deleteProperty(id: string, actor?: { id?: string; role?: string }) {
  const store = getStore();
  const existing = store.properties.find((p) => p.id === id);
  if (!existing || existing.softDeleted) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  existing.softDeleted = true;
  existing.status = "archived";
  existing.updatedAt = nowIso();
  saveStore();
  logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.delete",
    entityType: "property",
    entityId: id,
  });
  return { id, deleted: true };
}
