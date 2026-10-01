import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { leadCreateSchema } from "@/server/validation/schemas";
import { createLead, listLeads } from "@/server/services/crm";
import { agentScopeId, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const status = request.nextUrl.searchParams.get("status") || undefined;
    // Agents: ignore ?agentId= — session identity is authoritative.
    const agentId =
      session.role === "agent"
        ? agentScopeId(session)
        : request.nextUrl.searchParams.get("agentId") || undefined;
    const items = await listLeads({ agentId, status });
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const body = leadCreateSchema.parse(await request.json());
    if (session.role === "agent") {
      body.assignedAgentId = agentScopeId(session);
    }
    const item = await createLead(body);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
