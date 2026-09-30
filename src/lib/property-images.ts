import { fallbackImage } from "@/lib/money";

type WithImages = {
  imageUrl?: string | null;
  gallery?: string[] | null;
};

/** Cover first, then the rest of the gallery. Always at least the site fallback. */
export function listPropertyImages(item: WithImages): string[] {
  const cover = item.imageUrl?.trim();
  const raw = cover ? [cover, ...(item.gallery ?? [])] : (item.gallery ?? []);
  const seen = new Set<string>();
  const images: string[] = [];
  for (const src of raw) {
    const clean = src?.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    images.push(fallbackImage(clean));
  }
  return images.length ? images : [fallbackImage(null)];
}

export function frameLabel(index: number, total: number) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(index)} / ${pad(total)}`;
}
