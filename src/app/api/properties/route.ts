import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { propertyCreateSchema, propertyQuerySchema } from "@/server/validation/schemas";
import { createProperty, listProperties } from "@/server/services/properties";
import { getSessionFromRequest, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await getSessionFromRequest(request);
    const query = propertyQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    if (!session || session.role === "client") {
      const status = query.status === "sold" ? "sold" : "published";
      const data = await listProperties({ ...query, status });
      return jsonOk(data, { requestId });
    }

    await requireSession(request, ["admin", "agent"]);
    const data = await listProperties(query, {
      agentId: session.agentId,
      roles: [session.role],
    });
    return jsonOk(data, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const body = propertyCreateSchema.parse(await request.json());
    if (session.role === "agent") {
      body.agentId = session.agentId || session.id;
    }
    const item = await createProperty(body, { id: session.id, role: session.role });
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
