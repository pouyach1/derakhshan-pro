import { randomBytes } from "crypto";
import { ApiError } from "@/server/http/response";

const MAX_FILES = 15;
const MAX_BYTES = 2.5 * 1024 * 1024; // after client compress; hard cap
const ALLOWED = new Set(["image/jpeg", "image/png", "image/jpg"]);

type UploadKind = "properties" | "blog";

function uploadsRoot(kind: UploadKind = "properties") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path") as typeof import("path");
  return path.join(process.cwd(), "public", "uploads", kind);
}

async function saveImageUploads(
  files: File[],
  kind: UploadKind,
  maxFiles = MAX_FILES,
): Promise<string[]> {
  if (!files.length) {
    throw new ApiError(400, "NO_FILES", "هیچ فایلی ارسال نشده است");
  }
  if (files.length > maxFiles) {
    throw new ApiError(400, "TOO_MANY", `حداکثر ${maxFiles} عکس در هر بار مجاز است`);
  }

  let fs: typeof import("fs");
  let path: typeof import("path");
  try {
    fs = require("fs") as typeof import("fs");
    path = require("path") as typeof import("path");
  } catch {
    throw new ApiError(
      503,
      "UPLOAD_UNAVAILABLE",
      "آپلود فایل روی این محیط پشتیبانی نمی‌شود",
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const dir = path.join(uploadsRoot(kind), stamp);
  fs.mkdirSync(dir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const type = (file.type || "").toLowerCase();
    if (!ALLOWED.has(type) && !/\.(jpe?g|png)$/i.test(file.name)) {
      throw new ApiError(400, "BAD_TYPE", "فقط فرمت‌های JPG و PNG مجاز است");
    }
    if (file.size > MAX_BYTES) {
      throw new ApiError(400, "TOO_LARGE", "حجم هر عکس پس از بهینه‌سازی زیاد است");
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const id = randomBytes(8).toString("hex");
    // Always store as .jpg path when jpeg; keep .png extension if png mime
    const ext = type.includes("png") && !type.includes("jpeg") ? "png" : "jpg";
    const filename = `${id}.${ext}`;
    fs.writeFileSync(path.join(dir, filename), buf);
    urls.push(`/uploads/${kind}/${stamp}/${filename}`);
  }
  return urls;
}

export async function savePropertyImageUploads(files: File[]): Promise<string[]> {
  return saveImageUploads(files, "properties");
}

export async function saveBlogImageUploads(files: File[]): Promise<string[]> {
  return saveImageUploads(files, "blog", 1);
}
