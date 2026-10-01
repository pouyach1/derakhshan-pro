import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { blogUpdateSchema } from "@/server/validation/schemas";
import {
  deleteBlogPost,
  getBlogPostById,
  updateBlogPost,
} from "@/server/services/blog";
import { getSessionFromRequest, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const { id } = await ctx.params;
    const session = await getSessionFromRequest(request);
    const item = await getBlogPostById(id, { session });
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    const body = blogUpdateSchema.parse(await request.json());
    const item = await updateBlogPost(id, body, {
      id: session.id,
      role: session.role,
      agentId: session.agentId,
    });
    return jsonOk(item, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function DELETE(request: NextRequest, ctx: Ctx) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const { id } = await ctx.params;
    const result = await deleteBlogPost(id, {
      id: session.id,
      role: session.role,
      agentId: session.agentId,
    });
    return jsonOk(result, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
