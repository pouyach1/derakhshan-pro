/**
 * Blog data facade — AgencyStore.blogPosts is the source of truth.
 * Categories remain sync; post queries are async service wrappers for RSC/pages.
 */

import type { AuthSession } from "@/lib/auth";
import type { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES, type BlogCategory } from "@/data/blog-categories";
import {
  getBlogPostById as serviceGetById,
  getBlogPostBySlug as serviceGetBySlug,
  getRelatedBlogPosts as serviceGetRelated,
  listBlogPosts,
  listPublishedBlogPosts,
} from "@/server/services/blog";

export { BLOG_CATEGORIES, type BlogCategory };

/** Internal staff listing for middleware-protected admin routes. */
const STAFF_ADMIN_SESSION: AuthSession = {
  id: "system",
  phone: "",
  name: "",
  role: "admin",
};

export async function getBlogPosts(options?: {
  status?: BlogPost["status"];
}): Promise<BlogPost[]> {
  const result = await listBlogPosts(
    {
      page: 1,
      pageSize: 200,
      status: options?.status,
      q: undefined,
      category: undefined,
      authorUserId: undefined,
    },
    { session: STAFF_ADMIN_SESSION },
  );
  return result.items;
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return listPublishedBlogPosts();
}

/** Public-safe slug lookup — drafts never returned. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await serviceGetBySlug(slug, { publicOnly: true });
  return post ?? undefined;
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  try {
    return await serviceGetById(id, { session: STAFF_ADMIN_SESSION });
  } catch {
    return undefined;
  }
}

export async function getRelatedBlogPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  return serviceGetRelated(post, limit);
}
