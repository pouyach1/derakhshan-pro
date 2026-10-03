import type { z } from "zod";
import { revalidatePath } from "next/cache";
import type { AuthSession } from "@/lib/auth";
import type { BlogAuthor, BlogPost } from "@/types/blog";
import { estimateReadingTimeMinutes } from "@/lib/blog/reading-time";
import { decodeBlogSlugParam, normalizeBlogSlug, slugFromTitle } from "@/lib/blog/slug";
import { BLOG_CATEGORIES } from "@/data/blog-categories";
import { ApiError } from "@/server/http/response";
import { ensureBootstrapped } from "@/server/db/bootstrap";
import {
  getStore,
  newId,
  nowIso,
  saveStore,
  type BlogPostRecord,
  type UserRecord,
} from "@/server/db/store";
import type {
  blogCreateSchema,
  blogQuerySchema,
  blogUpdateSchema,
} from "@/server/validation/schemas";

type Actor = { id: string; role: string; agentId?: string | null };

function logActivity(input: {
  actorId?: string;
  actorRole?: string;
  action: string;
  entityId?: string;
  detail?: unknown;
}) {
  const store = getStore();
  store.activity.unshift({
    id: newId(),
    actorId: input.actorId ?? null,
    actorRole: input.actorRole ?? null,
    action: input.action,
    entityType: "blog",
    entityId: input.entityId ?? null,
    detail: (input.detail as Record<string, unknown>) ?? {},
    ip: null,
    requestId: null,
    createdAt: nowIso(),
  });
  store.activity = store.activity.slice(0, 500);
  saveStore();
}

function blogRows(): BlogPostRecord[] {
  const store = getStore();
  return store.blogPosts ?? (store.blogPosts = []);
}

function findUser(userId: string): UserRecord | undefined {
  return getStore().users.find((user) => user.id === userId);
}

function toAuthor(user: UserRecord | undefined, fallbackId: string): BlogAuthor {
  if (!user) {
    return { id: fallbackId, name: "نویسنده" };
  }
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatarUrl ?? undefined,
  };
}

export function mapBlogPost(record: BlogPostRecord): BlogPost {
  const user = findUser(record.authorUserId);
  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: record.content,
    coverImage: record.coverImage,
    category: record.category,
    author: toAuthor(user, record.authorUserId),
    status: record.status,
    publishedAt: record.publishedAt ?? undefined,
    readingTime: record.readingTime,
  };
}

function assertCanMutate(record: BlogPostRecord, actor: Actor) {
  if (actor.role === "admin") return;
  if (actor.role === "agent") {
    const ownsByUser = record.authorUserId === actor.id;
    const ownsByAgent =
      Boolean(actor.agentId) && record.authorAgentId === actor.agentId;
    if (ownsByUser || ownsByAgent) return;
    throw new ApiError(403, "FORBIDDEN", "این مقاله متعلق به مشاور دیگری است");
  }
  throw new ApiError(403, "FORBIDDEN", "دسترسی به این بخش مجاز نیست");
}

function assertUniqueSlug(slug: string, excludeId?: string) {
  const conflict = blogRows().find(
    (row) => !row.softDeleted && row.slug === slug && row.id !== excludeId,
  );
  if (conflict) {
    throw new ApiError(409, "SLUG_CONFLICT", "اسلاگ تکراری است؛ مقدار دیگری انتخاب کنید");
  }
}

function resolveUniqueSlug(base: string, excludeId?: string): string {
  let candidate = normalizeBlogSlug(base) || slugFromTitle(base);
  if (!candidate) candidate = `post-${newId().slice(0, 8)}`;
  let attempt = candidate;
  let n = 2;
  while (blogRows().some((row) => !row.softDeleted && row.slug === attempt && row.id !== excludeId)) {
    attempt = `${candidate}-${n}`;
    n += 1;
    if (n > 50) {
      attempt = `${candidate}-${newId().slice(0, 6)}`;
      break;
    }
  }
  return attempt;
}

function revalidateBlogPaths(slug?: string, id?: string) {
  try {
    revalidatePath("/blog");
    if (slug) revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");
    revalidatePath("/agent/blog");
    // Editor pages are dynamic by id — invalidate so publish/unpublish UI reflects store.
    if (id) {
      revalidatePath(`/admin/blog/${id}`);
      revalidatePath(`/agent/blog/${id}`);
    }
  } catch {
    /* outside request context (seed) — ignore */
  }
}

export async function listBlogPosts(
  query: z.infer<typeof blogQuerySchema>,
  scope?: { session?: AuthSession | null; publicOnly?: boolean },
) {
  await ensureBootstrapped();
  let rows = blogRows().filter((row) => !row.softDeleted);

  const session = scope?.session;
  const publicOnly =
    scope?.publicOnly ?? (!session || session.role === "client");

  if (publicOnly) {
    rows = rows.filter((row) => row.status === "published");
  } else if (session?.role === "agent") {
    rows = rows.filter(
      (row) =>
        row.authorUserId === session.id ||
        (session.agentId != null && row.authorAgentId === session.agentId),
    );
  }

  if (query.status && !publicOnly) {
    rows = rows.filter((row) => row.status === query.status);
  }
  if (query.category) {
    rows = rows.filter((row) => row.category === query.category);
  }
  if (query.authorUserId && session?.role === "admin") {
    rows = rows.filter((row) => row.authorUserId === query.authorUserId);
  }
  if (query.q) {
    const q = query.q.trim().toLowerCase();
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.excerpt.toLowerCase().includes(q) ||
        row.content.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q),
    );
  }

  rows = rows.sort((a, b) => {
    const aKey = a.publishedAt || a.updatedAt;
    const bKey = b.publishedAt || b.updatedAt;
    return bKey.localeCompare(aKey);
  });

  const total = rows.length;
  const start = (query.page - 1) * query.pageSize;
  const items = rows.slice(start, start + query.pageSize).map(mapBlogPost);
  return { items, page: query.page, pageSize: query.pageSize, total };
}

export async function listPublishedBlogPosts() {
  const result = await listBlogPosts(
    { page: 1, pageSize: 100, q: undefined, status: undefined, category: undefined, authorUserId: undefined },
    { publicOnly: true },
  );
  return result.items;
}

export async function getBlogPostById(
  id: string,
  opts?: { session?: AuthSession | null; publicOnly?: boolean },
): Promise<BlogPost> {
  await ensureBootstrapped();
  const row = blogRows().find((item) => item.id === id && !item.softDeleted);
  if (!row) throw new ApiError(404, "NOT_FOUND", "مقاله یافت نشد");

  const session = opts?.session;
  const publicOnly = opts?.publicOnly ?? (!session || session.role === "client");
  if (publicOnly && row.status !== "published") {
    throw new ApiError(404, "NOT_FOUND", "مقاله یافت نشد");
  }
  if (!publicOnly && session?.role === "agent") {
    assertCanMutate(row, {
      id: session.id,
      role: session.role,
      agentId: session.agentId,
    });
  }
  return mapBlogPost(row);
}

export async function getBlogPostBySlug(
  slug: string,
  opts?: { session?: AuthSession | null; publicOnly?: boolean },
): Promise<BlogPost | null> {
  await ensureBootstrapped();
  const decoded = decodeBlogSlugParam(slug);
  const normalized = normalizeBlogSlug(decoded) || decoded;
  const candidates = new Set(
    [decoded, normalized, slug.trim(), normalizeBlogSlug(slug)].filter(Boolean),
  );
  const row = blogRows().find(
    (item) => !item.softDeleted && candidates.has(item.slug),
  );
  if (!row) return null;

  const session = opts?.session;
  const publicOnly = opts?.publicOnly ?? (!session || session.role === "client");
  if (publicOnly && row.status !== "published") return null;
  if (!publicOnly && session?.role === "agent") {
    try {
      assertCanMutate(row, {
        id: session.id,
        role: session.role,
        agentId: session.agentId,
      });
    } catch {
      return null;
    }
  }
  return mapBlogPost(row);
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const published = await listPublishedBlogPosts();
  const same = published.filter(
    (item) => item.id !== post.id && item.category === post.category,
  );
  if (same.length >= limit) return same.slice(0, limit);
  const extras = published.filter(
    (item) =>
      item.id !== post.id && !same.some((related) => related.id === item.id),
  );
  return [...same, ...extras].slice(0, limit);
}

export async function getBlogStats(session?: AuthSession | null) {
  const { items } = await listBlogPosts(
    { page: 1, pageSize: 500, q: undefined, status: undefined, category: undefined, authorUserId: undefined },
    { session },
  );
  const published = items.filter((p) => p.status === "published").length;
  return {
    total: items.length,
    published,
    drafts: items.length - published,
  };
}

export async function createBlogPost(
  input: z.infer<typeof blogCreateSchema>,
  actor: Actor,
): Promise<BlogPost> {
  await ensureBootstrapped();
  if (actor.role !== "admin" && actor.role !== "agent") {
    throw new ApiError(403, "FORBIDDEN", "دسترسی به این بخش مجاز نیست");
  }

  const title = input.title.trim();
  const content = input.content.trim();
  const excerpt = input.excerpt.trim();
  if (!title) throw new ApiError(400, "VALIDATION", "عنوان الزامی است");
  if (!content) throw new ApiError(400, "VALIDATION", "متن مقاله الزامی است");

  const category = input.category.trim();
  if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) {
    throw new ApiError(400, "VALIDATION", "دسته‌بندی نامعتبر است");
  }

  let authorUserId = actor.id;
  let authorAgentId = actor.agentId ?? null;

  if (actor.role === "admin" && input.authorUserId) {
    const user = findUser(input.authorUserId);
    if (!user || (user.role !== "admin" && user.role !== "agent")) {
      throw new ApiError(400, "VALIDATION", "نویسنده نامعتبر است");
    }
    authorUserId = user.id;
    authorAgentId = user.agentId;
  } else if (actor.role === "agent") {
    authorUserId = actor.id;
    authorAgentId = actor.agentId ?? null;
  }

  let slug: string;
  if (input.slug?.trim()) {
    slug = normalizeBlogSlug(input.slug);
    if (!slug) throw new ApiError(400, "VALIDATION", "اسلاگ نامعتبر است");
    assertUniqueSlug(slug);
  } else {
    slug = resolveUniqueSlug(slugFromTitle(title));
  }

  const status = input.status ?? "draft";
  const stamp = nowIso();
  const readingTime =
    input.readingTime && input.readingTime > 0
      ? input.readingTime
      : estimateReadingTimeMinutes(content);

  const record: BlogPostRecord = {
    id: newId(),
    title,
    slug,
    excerpt,
    content,
    coverImage: (input.coverImage ?? "").trim(),
    category,
    authorUserId,
    authorAgentId,
    status,
    softDeleted: false,
    publishedAt: status === "published" ? stamp : null,
    readingTime,
    createdAt: stamp,
    updatedAt: stamp,
  };

  blogRows().unshift(record);
  saveStore();
  logActivity({
    actorId: actor.id,
    actorRole: actor.role,
    action: "blog.create",
    entityId: record.id,
    detail: { status: record.status, slug: record.slug },
  });
  revalidateBlogPaths(
    record.status === "published" ? record.slug : undefined,
    record.id,
  );
  return mapBlogPost(record);
}

export async function updateBlogPost(
  id: string,
  input: z.infer<typeof blogUpdateSchema>,
  actor: Actor,
): Promise<BlogPost> {
  await ensureBootstrapped();
  const row = blogRows().find((item) => item.id === id && !item.softDeleted);
  if (!row) throw new ApiError(404, "NOT_FOUND", "مقاله یافت نشد");
  assertCanMutate(row, actor);

  const previousSlug = row.slug;

  if (input.title != null) {
    const title = input.title.trim();
    if (!title) throw new ApiError(400, "VALIDATION", "عنوان الزامی است");
    row.title = title;
  }
  if (input.content != null) {
    const content = input.content.trim();
    if (!content) throw new ApiError(400, "VALIDATION", "متن مقاله الزامی است");
    row.content = content;
    row.readingTime = estimateReadingTimeMinutes(content);
  }
  if (input.excerpt != null) row.excerpt = input.excerpt.trim();
  if (input.coverImage != null) row.coverImage = input.coverImage.trim();
  if (input.category != null) {
    const category = input.category.trim();
    if (!(BLOG_CATEGORIES as readonly string[]).includes(category)) {
      throw new ApiError(400, "VALIDATION", "دسته‌بندی نامعتبر است");
    }
    row.category = category;
  }
  if (input.readingTime != null && input.readingTime > 0) {
    row.readingTime = input.readingTime;
  }
  if (input.slug != null) {
    const slug = normalizeBlogSlug(input.slug);
    if (!slug) throw new ApiError(400, "VALIDATION", "اسلاگ نامعتبر است");
    assertUniqueSlug(slug, row.id);
    row.slug = slug;
  }

  if (input.status != null) {
    if (input.status === "published" && row.status !== "published") {
      row.publishedAt = row.publishedAt || nowIso();
    }
    if (input.status === "draft") {
      // Keep publishedAt for history; public queries use status === published.
    }
    row.status = input.status;
  }

  if (actor.role === "admin" && input.authorUserId) {
    const user = findUser(input.authorUserId);
    if (!user || (user.role !== "admin" && user.role !== "agent")) {
      throw new ApiError(400, "VALIDATION", "نویسنده نامعتبر است");
    }
    row.authorUserId = user.id;
    row.authorAgentId = user.agentId;
  }

  row.updatedAt = nowIso();
  saveStore();
  logActivity({
    actorId: actor.id,
    actorRole: actor.role,
    action: "blog.update",
    entityId: row.id,
    detail: { status: row.status, slug: row.slug },
  });
  revalidateBlogPaths(row.slug, row.id);
  if (previousSlug !== row.slug) revalidateBlogPaths(previousSlug, row.id);
  return mapBlogPost(row);
}

export async function deleteBlogPost(id: string, actor: Actor) {
  await ensureBootstrapped();
  const row = blogRows().find((item) => item.id === id && !item.softDeleted);
  if (!row) throw new ApiError(404, "NOT_FOUND", "مقاله یافت نشد");
  assertCanMutate(row, actor);
  row.softDeleted = true;
  row.updatedAt = nowIso();
  saveStore();
  logActivity({
    actorId: actor.id,
    actorRole: actor.role,
    action: "blog.delete",
    entityId: row.id,
    detail: { slug: row.slug },
  });
  revalidateBlogPaths(row.slug, row.id);
  return { id: row.id, deleted: true as const };
}

export async function publishBlogPost(id: string, actor: Actor) {
  return updateBlogPost(id, { status: "published" }, actor);
}

export async function unpublishBlogPost(id: string, actor: Actor) {
  return updateBlogPost(id, { status: "draft" }, actor);
}
