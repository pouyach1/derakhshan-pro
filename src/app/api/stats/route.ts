import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { getPlatformStats } from "@/server/services/crm";
import { agentScopeId, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const stats =
      session.role === "agent"
        ? await getPlatformStats({ agentId: agentScopeId(session) })
        : await getPlatformStats();
    return jsonOk(stats, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
