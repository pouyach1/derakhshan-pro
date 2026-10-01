/**
 * Allow only http(s) and same-site relative paths in user-authored markdown links.
 */
export function sanitizeBlogHref(href: string): string | null {
  const value = href.trim();
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    /* invalid */
  }
  return null;
}
