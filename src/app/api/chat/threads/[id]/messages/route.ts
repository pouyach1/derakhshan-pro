import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { chatMessageCreateSchema } from "@/server/validation/schemas";
import { listThreadMessages, postThreadMessage } from "@/server/services/chat";
import { requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent", "client"]);
    const { id } = await ctx.params;
    const items = await listThreadMessages(id, session);
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent", "client"]);
    const { id } = await ctx.params;
    const body = chatMessageCreateSchema.parse(await request.json());
    const result = await postThreadMessage(id, body.body, session);
    return jsonOk(result, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
