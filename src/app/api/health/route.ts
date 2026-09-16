import { nanoid } from "nanoid";
import { getStore } from "@/server/db/store";
import { jsonError, jsonOk } from "@/server/http/response";
import { siteConfig } from "@/config/siteConfig";

export async function GET() {
  const requestId = nanoid(10);
  try {
    const started = Date.now();
    const store = getStore();
    return jsonOk(
      {
        status: "healthy",
        brand: siteConfig.brand.nameFa,
        latencyMs: Date.now() - started,
        version: "1.1.0",
        persistence: "json-store",
        counts: {
          users: store.users.length,
          properties: store.properties.length,
          leads: store.leads.length,
        },
        modules: [
          "auth",
          "properties",
          "leads",
          "agents",
          "clients",
          "tours",
          "contact",
          "stats",
        ],
      },
      { requestId },
    );
  } catch (error) {
    return jsonError(error, requestId);
  }
}
