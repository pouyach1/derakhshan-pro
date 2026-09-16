import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { listAgents } from "@/server/services/crm";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    await requireSession(request, ["admin", "agent"]);
    const items = await listAgents();
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
