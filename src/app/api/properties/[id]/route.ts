import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { propertyUpdateSchema } from "@/server/validation/schemas";
import {
  deleteProperty,
  getProperty,
  updateProperty,
} from "@/server/services/properties";
import { requireSession, getSessionFromRequest } from "@/server/http/guard";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const { id } = await ctx.params;
    const session = await getSessionFromRequest(_request);
    const countView = _request.nextUrl.searchParams.get("view") === "1";
    const item = await getProperty(id, { countView });
    const staff = session?.role === "admin" || session?.role === "agent";
    if (!staff && item.status !== "published" && item.status !== "sold") {
      throw new ApiError(404, "NOT_FOUND", "ملک یافت نشد");
    }
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    const body = propertyUpdateSchema.parse(await request.json());
    if (session.role === "agent") {
      const current = await getProperty(id);
      if (current.agentId && current.agentId !== session.agentId) {
        throw new ApiError(403, "FORBIDDEN", "این ملک متعلق به مشاور دیگری است");
      }
    }
    const item = await updateProperty(id, body, { id: session.id, role: session.role });
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    if (session.role === "agent") {
      const current = await getProperty(id);
      if (current.agentId && current.agentId !== session.agentId) {
        throw new ApiError(403, "FORBIDDEN", "این ملک متعلق به مشاور دیگری است");
      }
    }
    const result = await deleteProperty(id, { id: session.id, role: session.role });
    return jsonOk(result, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
