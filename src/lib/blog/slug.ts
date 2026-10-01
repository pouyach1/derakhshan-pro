/**
 * URL-safe slug normalization for editorial posts.
 * Deterministic: same title → same base slug (collisions handled by caller).
 */

export function normalizeBlogSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export function slugFromTitle(title: string): string {
  const base = normalizeBlogSlug(title);
  return base || `post-${Date.now().toString(36)}`;
}
