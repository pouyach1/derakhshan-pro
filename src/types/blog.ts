/**
 * Canonical blog domain types — Phase 1 foundation.
 * Future data layers should map into these shapes.
 */

export type BlogStatus = "draft" | "published";

export type BlogAuthor = {
  id: string;
  name: string;
  avatar?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: BlogAuthor;
  status: BlogStatus;
  publishedAt?: string;
  readingTime: number;
};
