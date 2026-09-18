import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  getProperty,
  listPropertyImages,
  replacePropertyImages,
} from "@/server/services/properties";
import { getSessionFromRequest, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

const replaceSchema = z.object({
  urls: z.array(z.string().min(1)).min(1),
});

export async function GET(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const { id } = await ctx.params;
    const session = await getSessionFromRequest(request);
    const property = await getProperty(id);
    const staff = session?.role === "admin" || session?.role === "agent";
    if (!staff && property.status !== "published" && property.status !== "sold") {
      throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
    }
    const items = await listPropertyImages(id);
    return jsonOk({ items, gallery: property.gallery, imageUrl: property.imageUrl }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function PUT(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    const body = replaceSchema.parse(await request.json());
    if (session.role === "agent") {
      const current = await getProperty(id);
      if (current.agentId && current.agentId !== session.agentId) {
        throw new ApiError(403, "FORBIDDEN", "این ملک متعلق به مشاور دیگری است");
      }
    }
    const items = await replacePropertyImages(id, body.urls, {
      id: session.id,
      role: session.role,
    });
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
