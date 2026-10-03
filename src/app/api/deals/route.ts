import { NextRequest } from "next/server";
import { nanoid } from "@/lib/id";
import { z } from "zod";
import {
  createDeal,
  getProperty,
  listDeals,
  listPublicClosedDeals,
} from "@/server/services/properties";
import {
  agentScopeId,
  assertAgentOwns,
  getSessionFromRequest,
  requireSession,
} from "@/server/http/guard";
import { jsonError, jsonOk } from "@/server/http/response";

const dealCreateSchema = z.object({
  propertyId: z.string().optional(),
  title: z.string().min(2),
  dealType: z.enum(["sale", "rent"]).default("sale"),
  status: z.enum(["pending", "closed", "canceled"]).default("closed"),
  price: z.number().nonnegative(),
  buyerName: z.string().optional(),
  sellerName: z.string().optional(),
  agentId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await getSessionFromRequest(request);
    if (session?.role === "admin") {
      const items = await listDeals();
      return jsonOk({ items }, { requestId });
    }
    if (session?.role === "agent") {
      const items = await listDeals({ agentId: agentScopeId(session) });
      return jsonOk({ items }, { requestId });
    }

    // Public marketing page: closed deals only, safe fields.
    const items = await listPublicClosedDeals();
    return jsonOk({ items }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}

export async function POST(request: NextRequest) {
  const requestId = nanoid(10);
  try {
    const session = await requireSession(request, ["admin", "agent"]);
    const body = dealCreateSchema.parse(await request.json());
    if (session.role === "agent") {
      // Session scope wins — never trust client-supplied agentId.
      body.agentId = agentScopeId(session);
      // Agents may only attach deals to properties they own.
      if (body.propertyId) {
        const property = await getProperty(body.propertyId);
        assertAgentOwns(
          property.agentId,
          session,
          "این ملک متعلق به مشاور دیگری است",
        );
      }
    }
    const item = await createDeal(body);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
