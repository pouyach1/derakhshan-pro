import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { tourCreateSchema, tourUpdateSchema } from "@/server/validation/schemas";
import { createTour, listTours, updateTour } from "@/server/services/crm";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk, ApiError } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const agentId =
      session.role === "agent"
        ? session.agentId || session.id
        : request.nextUrl.searchParams.get("agentId");
    if (!agentId) throw new ApiError(400, "AGENT_REQUIRED", "شناسه مشاور لازم است");
    const items = await listTours(agentId);
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const body = tourCreateSchema.parse(await request.json());
    const agentId = session.agentId || session.id;
    const item = await createTour(agentId, body);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const id = request.nextUrl.searchParams.get("id");
    if (!id) throw new ApiError(400, "ID_REQUIRED", "شناسه بازدید لازم است");
    const body = tourUpdateSchema.parse(await request.json());
    const item = await updateTour(id, session.agentId || session.id, body);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
