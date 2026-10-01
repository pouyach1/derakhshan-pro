import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";
import { saveBlogImageUploads } from "@/server/uploads/images";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    await requireSession(request, ["admin", "agent"]);
    const form = await request.formData();
    const files = form
      .getAll("files")
      .filter((item): item is File => typeof File !== "undefined" && item instanceof File);

    if (!files.length) {
      const raw = form.getAll("files");
      for (const item of raw) {
        if (item && typeof item === "object" && "arrayBuffer" in item && "name" in item) {
          files.push(item as File);
        }
      }
    }

    if (!files.length) {
      throw new ApiError(400, "NO_FILES", "فایل تصویری انتخاب نشده است");
    }

    const urls = await saveBlogImageUploads(files.slice(0, 1));
    return jsonOk({ urls, url: urls[0] ?? null }, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
