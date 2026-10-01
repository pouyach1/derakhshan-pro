import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { listAgents } from "@/server/services/crm";
import { agentScopeId, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const items =
      session.role === "agent"
        ? await listAgents({ agentId: agentScopeId(session), userId: session.id })
        : await listAgents();
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
