/**
 * URL-safe slug normalization for editorial posts.
 * Deterministic: same title → same base slug (collisions handled by caller).
 */

/** Decode a route/query slug that may still be percent-encoded. */
export function decodeBlogSlugParam(input: string): string {
  const raw = input.trim();
  if (!raw) return "";
  try {
    // Paths may arrive once or twice encoded depending on runtime/proxy.
    let value = raw;
    for (let i = 0; i < 2; i += 1) {
      if (!/%[0-9A-Fa-f]{2}/.test(value)) break;
      value = decodeURIComponent(value);
    }
    return value.trim();
  } catch {
    return raw;
  }
}

export function normalizeBlogSlug(input: string): string {
  const decoded = decodeBlogSlugParam(input);
  return decoded
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/**
 * Prefer Latin slugs for reliability across hosts/CDNs.
 * If the title has no Latin characters, fall back to a stable post-* token
 * (authors can still type a custom Persian slug manually).
 */
export function slugFromTitle(title: string): string {
  const decoded = decodeBlogSlugParam(title);
  const latin = decoded
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  if (latin) return latin;

  const persian = normalizeBlogSlug(decoded);
  if (persian) return persian;

  return `post-${Date.now().toString(36)}`;
}
