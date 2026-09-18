import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { clientUpdateSchema } from "@/server/validation/schemas";
import { updateClient } from "@/server/services/crm";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    const body = clientUpdateSchema.parse(await request.json());
    const scope =
      session.role === "agent" ? { agentId: session.agentId || session.id } : undefined;
    const item = await updateClient(id, body, scope);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
