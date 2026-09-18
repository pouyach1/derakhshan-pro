import type { z } from "zod";
import { ApiError } from "@/server/http/response";
import {
  getStore,
  newId,
  nowIso,
  saveStore,
  type DealRecord,
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

function syncPropertyImages(property: PropertyRecord) {
  const store = getStore();
  const images = store.propertyImages ?? (store.propertyImages = []);
  const kept = images.filter((row) => row.propertyId !== property.id);
  const urls = (property.gallery?.length
    ? property.gallery
    : property.imageUrl
      ? [property.imageUrl]
      : []
  ).filter(Boolean);
  const next = urls.map((url, index) => ({
    id: newId(),
    propertyId: property.id,
    url,
    alt: property.title,
    sortOrder: index,
    isCover: index === 0 || url === property.imageUrl,
    createdAt: nowIso(),
  }));
  store.propertyImages = [...next, ...kept];
  if (urls[0]) property.imageUrl = property.imageUrl || urls[0];
  if (!property.gallery?.length) property.gallery = urls;
}

function ensureDealForSoldProperty(property: PropertyRecord, actor?: { id?: string; role?: string }) {
  if (property.status !== "sold") return;
  const store = getStore();
  const deals = store.deals ?? (store.deals = []);
  const existing = deals.find((deal) => deal.propertyId === property.id && deal.status === "closed");
  if (existing) return existing;
  const deal: DealRecord = {
    id: newId(),
    propertyId: property.id,
    title: property.title,
    dealType: property.listingType === "rent" ? "rent" : "sale",
    status: "closed",
    price: property.price,
    currency: property.currency || "IRR",
    buyerName: null,
    sellerName: null,
    agentId: property.agentId,
    closedAt: nowIso(),
    notes: "ثبت خودکار پس از تغییر وضعیت به واگذار شده",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  deals.unshift(deal);
  logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "deal.create",
    entityType: "deal",
    entityId: deal.id,
    detail: { propertyId: property.id },
  });
  return deal;
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

export async function listPropertyImages(propertyId: string) {
  await ensureBootstrapped();
  const store = getStore();
  return (store.propertyImages ?? [])
    .filter((row) => row.propertyId === propertyId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function replacePropertyImages(
  propertyId: string,
  urls: string[],
  actor?: { id?: string; role?: string },
) {
  await ensureBootstrapped();
  const store = getStore();
  const property = store.properties.find((p) => p.id === propertyId && !p.softDeleted);
  if (!property) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  const clean = urls.map((url) => url.trim()).filter(Boolean);
  if (!clean.length) throw new ApiError(400, "IMAGES_REQUIRED", "حداقل یک تصویر لازم است");
  property.gallery = clean;
  property.imageUrl = clean[0];
  property.version += 1;
  property.updatedAt = nowIso();
  syncPropertyImages(property);
  saveStore();
  logActivity({
    actorId: actor?.id,
    actorRole: actor?.role,
    action: "property.images.replace",
    entityType: "property",
    entityId: propertyId,
    detail: { count: clean.length },
  });
  return listPropertyImages(propertyId);
}

export async function createProperty(
  input: z.infer<typeof propertyCreateSchema>,
  actor?: { id?: string; role?: string },
) {
  await ensureBootstrapped();
  const store = getStore();
  const id = newId();
  const code = input.code || `PR-${Date.now().toString().slice(-6)}`;
  const cover = input.imageUrl || input.gallery[0] || "/images/landing/hero/banner.jpg";
  const gallery = input.gallery.length ? input.gallery : [cover];
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
    imageUrl: cover,
    gallery,
    agentId: input.agentId ?? null,
    views: 0,
    isFeatured: input.isFeatured ?? false,
    softDeleted: false,
    version: 1,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  store.properties.unshift(row);
  syncPropertyImages(row);
  ensureDealForSoldProperty(row, actor);
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
  await ensureBootstrapped();
  const store = getStore();
  const existing = store.properties.find((p) => p.id === id && !p.softDeleted);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
  if (input.version != null && input.version !== existing.version) {
    throw new ApiError(409, "VERSION_CONFLICT", "نسخه ملک تغییر کرده است؛ دوباره تلاش کنید");
  }

  const prevStatus = existing.status;
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
  if (input.gallery || input.imageUrl) syncPropertyImages(existing);
  if (existing.status === "sold" && prevStatus !== "sold") {
    ensureDealForSoldProperty(existing, actor);
  }
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
  await ensureBootstrapped();
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

export async function listDeals() {
  await ensureBootstrapped();
  const store = getStore();
  return [...(store.deals ?? [])].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function createDeal(input: {
  propertyId?: string;
  title: string;
  dealType?: "sale" | "rent";
  status?: DealRecord["status"];
  price: number;
  buyerName?: string;
  sellerName?: string;
  agentId?: string;
  notes?: string;
}) {
  await ensureBootstrapped();
  const store = getStore();
  const deals = store.deals ?? (store.deals = []);
  const row: DealRecord = {
    id: newId(),
    propertyId: input.propertyId ?? null,
    title: input.title,
    dealType: input.dealType ?? "sale",
    status: input.status ?? "closed",
    price: input.price,
    currency: "IRR",
    buyerName: input.buyerName ?? null,
    sellerName: input.sellerName ?? null,
    agentId: input.agentId ?? null,
    closedAt: input.status === "pending" ? null : nowIso(),
    notes: input.notes ?? "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  deals.unshift(row);
  saveStore();
  return row;
}
