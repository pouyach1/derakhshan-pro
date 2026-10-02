import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { getPublicAgent } from "@/server/services/agents-public";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

/** Public agent resume — available to any logged-in visitor. */
export async function GET(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    await requireSession(request, ["admin", "agent", "client"]);
    const { id } = await ctx.params;
    const item = await getPublicAgent(id);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
