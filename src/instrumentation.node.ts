/**
 * Node-only startup checks. Kept out of Edge instrumentation so webpack
 * never pulls node:crypto / node:fs into the Edge bundle.
 */
import { assertProductionEnv } from "@/server/env";

export async function registerNode() {
  try {
    assertProductionEnv();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    if (typeof process !== "undefined" && typeof process.exit === "function") {
      process.exit(1);
    }
    throw error;
  }
}
