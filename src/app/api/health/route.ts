import { nanoid } from "nanoid";
import { getStore } from "@/server/db/store";
import { jsonError, jsonOk } from "@/server/http/response";
import { siteConfig } from "@/config/siteConfig";
import { ensureBootstrapped } from "@/server/db/bootstrap";

export async function GET() {
  const requestId = nanoid(10);
  try {
    const started = Date.now();
    await ensureBootstrapped();
    const store = getStore();
    return jsonOk(
      {
        status: "healthy",
        brand: siteConfig.brand.nameFa,
        latencyMs: Date.now() - started,
        version: "1.2.0",
        persistence: "json-store",
        counts: {
          users: store.users.length,
          properties: store.properties.length,
          propertyImages: (store.propertyImages ?? []).length,
          leads: store.leads.length,
          clients: store.clients.length,
          tours: store.tours.length,
          deals: (store.deals ?? []).length,
          activity: store.activity.length,
        },
        modules: [
          "auth",
          "properties",
          "property-images",
          "listings",
          "inquiries",
          "leads",
          "agents",
          "clients",
          "tours",
          "deals",
          "activity",
          "contact",
          "settings",
          "stats",
        ],
      },
      { requestId },
    );
  } catch (error) {
    return jsonError(error, requestId);
  }
}
