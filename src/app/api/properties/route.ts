import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { propertyCreateSchema, propertyQuerySchema } from "@/server/validation/schemas";
import { createProperty, listProperties } from "@/server/services/properties";
import { requireSession, clientIp } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const query = propertyQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
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
