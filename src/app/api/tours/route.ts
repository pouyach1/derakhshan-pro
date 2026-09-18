import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
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
        : request.nextUrl.searchParams.get("agentId") || undefined;
    if (session.role === "agent" && !agentId) {
      throw new ApiError(400, "AGENT_REQUIRED", "شناسه مشاور لازم است");
    }
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
    const json = await request.json();
    const body = tourCreateSchema.parse(json);
    const agentId =
      session.role === "agent"
        ? session.agentId || session.id
        : typeof json.agentId === "string"
          ? json.agentId
          : "a1";
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
    const scopeAgentId = session.role === "admin" ? null : session.agentId || session.id;
    const item = await updateTour(id, scopeAgentId, body);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
