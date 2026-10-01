import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { blogCreateSchema, blogQuerySchema } from "@/server/validation/schemas";
import { createBlogPost, listBlogPosts } from "@/server/services/blog";
import { getSessionFromRequest, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await getSessionFromRequest(request);
    const query = blogQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const data = await listBlogPosts(query, { session });
    return jsonOk(data, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const body = blogCreateSchema.parse(await request.json());
    const item = await createBlogPost(body, {
      id: session.id,
      role: session.role,
      agentId: session.agentId,
    });
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
