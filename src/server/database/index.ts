/**
 * Database architecture root (Phase A).
 *
 * Physical persistence remains the edge-safe JSON store.
 * This module organizes schema, connection adapter, seed, queries, and migration registry.
 */

export * from "./schema";
export * from "./connection";
export * from "./migrations";
export * from "./seed";
export * as dbQueries from "./queries";
