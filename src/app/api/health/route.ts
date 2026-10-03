import { nanoid } from "@/lib/id";
import { jsonError, jsonOk } from "@/server/http/response";
import { getPersistenceDiagnostics } from "@/server/db/store";

/**
 * Public liveness + non-sensitive persistence diagnostics.
 * Never call ensureBootstrapped / bcrypt here (Workers CPU / Error 1102).
 * Does not expose paths, secrets, env values, or record payloads.
 */
export async function GET() {
  const requestId = nanoid(10);
  try {
    const persistence = getPersistenceDiagnostics();
    const status = persistence.corrupt ? "degraded" : "healthy";
    return jsonOk(
      {
        status,
        persistence: {
          mode: persistence.mode,
          readable: persistence.readable,
          writable: persistence.writable,
          initialized: persistence.initialized,
          corrupt: persistence.corrupt,
          schemaVersion: persistence.schemaVersion,
          empty: persistence.empty,
        },
      },
      { requestId, status: persistence.corrupt ? 503 : 200 },
    );
  } catch (error) {
    return jsonError(error, requestId);
  }
}
