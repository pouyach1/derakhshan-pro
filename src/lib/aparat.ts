/**
 * Aparat helpers — store share URLs, play via lightweight iframe embeds.
 */

const APARAT_HASH =
  /(?:aparat\.com\/(?:v\/|video\/video\/embed\/videohash\/)|aparat\.com\/video\/)([A-Za-z0-9]+)/i;

export function extractAparatHash(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^[A-Za-z0-9]{4,20}$/.test(value)) return value;
  const match = value.match(APARAT_HASH);
  return match?.[1] ?? null;
}

export function aparatEmbedUrl(input: string): string | null {
  const hash = extractAparatHash(input);
  if (!hash) return null;
  return `https://www.aparat.com/video/video/embed/videohash/${hash}/vt/frame`;
}

export function aparatWatchUrl(input: string): string | null {
  const hash = extractAparatHash(input);
  if (!hash) return null;
  return `https://www.aparat.com/v/${hash}`;
}

export function isValidAparatUrl(input: string): boolean {
  return Boolean(extractAparatHash(input));
}
