import { nanoid } from "nanoid";
import { ensureSchema } from "@/server/db/migrate";
import { getDbClient } from "@/server/db/client";
import { jsonError, jsonOk } from "@/server/http/response";
import { siteConfig } from "@/config/siteConfig";

export async function GET() {
  const requestId = nanoid(10);
  try {
    const started = Date.now();
    await ensureSchema();
    await getDbClient().execute("select 1 as ok");
    return jsonOk(
      {
        status: "healthy",
        brand: siteConfig.brand.nameFa,
        latencyMs: Date.now() - started,
        version: "1.0.0",
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
