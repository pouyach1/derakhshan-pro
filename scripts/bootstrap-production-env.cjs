#!/usr/bin/env node
/**
 * One-shot: create data/production.env with strong AUTH_SECRET + SEED_ADMIN_PASSWORD.
 * Safe to re-run — keeps existing strong values, only fills what is missing/weak.
 *
 *   node scripts/bootstrap-production-env.cjs
 */
const { bootstrapOnly } = require("./production-env.cjs");

try {
  bootstrapOnly();
} catch (error) {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
}
