import { nanoid } from "nanoid";
import { jsonError, jsonOk } from "@/server/http/response";

/**
 * Public liveness only — never call ensureBootstrapped here.
 * Seeding/bcrypt on health checks burns Workers CPU and can trip Error 1102.
 */
export async function GET() {
  const requestId = nanoid(10);
  try {
    return jsonOk({ status: "healthy" }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
