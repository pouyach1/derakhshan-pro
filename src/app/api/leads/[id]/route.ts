import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { leadUpdateSchema } from "@/server/validation/schemas";
import { updateLead } from "@/server/services/crm";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    const body = leadUpdateSchema.parse(await request.json());
    const item = await updateLead(id, body);
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
