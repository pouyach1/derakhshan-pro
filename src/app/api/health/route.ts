import { nanoid } from "nanoid";
import { jsonError, jsonOk } from "@/server/http/response";
import { ensureBootstrapped } from "@/server/db/bootstrap";

/** Public liveness/readiness — no internal inventory or module details. */
export async function GET() {
  const requestId = nanoid(10);
  try {
    await ensureBootstrapped();
    return jsonOk({ status: "healthy" }, { requestId });
  } catch (error) {
    return jsonError(error, requestId);
  }
}
