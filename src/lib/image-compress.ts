/** Client-side compress before upload — keeps listings fast without heavy formats. */

export const PROPERTY_IMAGE = {
  maxCount: 15,
  minCount: 1,
  /** Accept only the two common camera/upload formats */
  accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
  mime: ["image/jpeg", "image/png"] as const,
  /** Reject before compress if larger than this */
  maxInputBytes: 8 * 1024 * 1024,
  maxEdge: 1600,
  jpegQuality: 0.82,
} as const;

export function isAllowedImageFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if ((PROPERTY_IMAGE.mime as readonly string[]).includes(type)) return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
}

export async function compressImageFile(file: File): Promise<Blob> {
  if (!isAllowedImageFile(file)) {
    throw new Error("فقط JPG و PNG مجاز است");
  }
  if (file.size > PROPERTY_IMAGE.maxInputBytes) {
    throw new Error("حجم هر عکس حداکثر ۸ مگابایت باشد");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, PROPERTY_IMAGE.maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("فشرده‌سازی تصویر ممکن نشد");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", PROPERTY_IMAGE.jpegQuality),
  );
  if (!blob) throw new Error("خروجی تصویر ساخته نشد");
  return blob;
}
