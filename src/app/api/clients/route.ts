import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { clientCreateSchema } from "@/server/validation/schemas";
import { createClient, listClients } from "@/server/services/crm";
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
    const items = await listClients(agentId);
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
    const body = clientCreateSchema.parse(json);
    const agentId =
      session.role === "agent"
        ? session.agentId || session.id
        : typeof json.agentId === "string"
          ? json.agentId
          : request.nextUrl.searchParams.get("agentId") || "a1";
    const item = await createClient(agentId, body);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
