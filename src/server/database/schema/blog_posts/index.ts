/**
 * Persisted blog post rows inside AgencyStore (JSON adapter).
 * Author is a UserRecord FK — no duplicate Author model.
 */

export type BlogPostStatus = "draft" | "published";

export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown-subset plain text (same format as Phase 5.1 editor). */
  content: string;
  coverImage: string;
  /** Denormalized category label (matches BLOG_CATEGORIES). */
  category: string;
  /** FK → users.id */
  authorUserId: string;
  /** FK → users.agentId when author is an agent; null for admin-authored. */
  authorAgentId: string | null;
  status: BlogPostStatus;
  softDeleted: boolean;
  publishedAt: string | null;
  /** Cached estimate; recomputed when content changes. */
  readingTime: number;
  createdAt: string;
  updatedAt: string;
};
