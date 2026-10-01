import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { clientCreateSchema } from "@/server/validation/schemas";
import { createClient, listClients } from "@/server/services/crm";
import { agentScopeId, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    // Agents: ignore ?agentId= — session identity is authoritative.
    const agentId =
      session.role === "agent"
        ? agentScopeId(session)
        : request.nextUrl.searchParams.get("agentId") || undefined;
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
        ? agentScopeId(session)
        : typeof json.agentId === "string"
          ? json.agentId
          : request.nextUrl.searchParams.get("agentId") || "a1";
    const item = await createClient(agentId, body);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
