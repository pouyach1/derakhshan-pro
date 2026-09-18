import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { createDeal, listDeals, listPublicClosedDeals } from "@/server/services/properties";
import { getSessionFromRequest, requireSession } from "@/server/http/guard";
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
    if (session && (session.role === "admin" || session.role === "agent")) {
      const items = await listDeals();
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
    if (session.role === "agent") body.agentId = session.agentId || session.id;
    const item = await createDeal(body);
    return jsonOk(item, { requestId, status: 201 });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
