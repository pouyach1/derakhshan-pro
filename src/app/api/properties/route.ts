import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { propertyCreateSchema, propertyQuerySchema } from "@/server/validation/schemas";
import { createProperty, listProperties } from "@/server/services/properties";
import { presentProperties } from "@/server/services/agents-public";
import { agentScopeId, getSessionFromRequest, requireSession } from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await getSessionFromRequest(request);
    const query = propertyQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );
    const canSeePrice = Boolean(session);

    // Guests and clients: published (and sold) public catalog only.
    if (!session || session.role === "client") {
      const status = query.status === "sold" ? "sold" : "published";
      const data = await listProperties({ ...query, agentId: undefined, status });
      return jsonOk(
        { ...data, items: presentProperties(data.items, canSeePrice) },
        { requestId },
      );
    }

    if (session.role === "agent") {
      const mine = agentScopeId(session);
      const data = await listProperties(
        { ...query, agentId: undefined },
        { agentId: mine, roles: ["agent"] },
      );
      return jsonOk(
        { ...data, items: presentProperties(data.items, true) },
        { requestId },
      );
    }

    const data = await listProperties(query, {
      roles: ["admin"],
    });
    return jsonOk(
      { ...data, items: presentProperties(data.items, true) },
      { requestId },
    );
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
      body.agentId = agentScopeId(session);
    }
    const item = await createProperty(body, { id: session.id, role: session.role });
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
