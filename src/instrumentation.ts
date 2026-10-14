/**
 * Next.js instrumentation — validates production secrets before serving traffic.
 * Runs for the Node runtime used by `next start` / server.cjs.
 * Skipped during `next build` so CI/local builds do not need secrets.
 *
 * Node checks live in instrumentation.node.ts. The dynamic import uses
 * webpackIgnore so Edge instrumentation never pulls node:crypto / node:fs
 * (fixes Parspack / Next edge compile failures).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const path = "./instrumentation" + ".node";
  const mod = (await import(
    /* webpackIgnore: true */
    path
  )) as { registerNode: () => Promise<void> };
  await mod.registerNode();
}
