/**
 * Next.js instrumentation — validates production secrets before serving traffic.
 * Runs for the Node runtime used by `next start` / server.cjs.
 * Skipped during `next build` so CI/local builds do not need secrets.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "edge") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { assertProductionEnv } = await import("@/server/env");
  try {
    assertProductionEnv();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    // Fail hard on Node so misconfigured cPanel apps never serve insecure sessions.
    if (typeof process !== "undefined" && typeof process.exit === "function") {
      process.exit(1);
    }
    throw error;
  }
}
