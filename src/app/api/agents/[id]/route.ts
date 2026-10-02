import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { getPublicAgent } from "@/server/services/agents-public";
import { jsonError, jsonOk } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

/** Public agent resume — available to any visitor. */
export async function GET(_request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const { id } = await ctx.params;
    const item = await getPublicAgent(id);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
