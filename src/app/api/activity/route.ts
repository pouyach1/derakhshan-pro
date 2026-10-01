import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { listActivity } from "@/server/services/crm";
import { agentScopeId, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const raw = Number(request.nextUrl.searchParams.get("limit") || "50");
    const limit = Number.isFinite(raw) ? raw : 50;
    const items =
      session.role === "agent"
        ? await listActivity(limit, {
            actorId: session.id,
            agentId: agentScopeId(session),
          })
        : await listActivity(limit);
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
