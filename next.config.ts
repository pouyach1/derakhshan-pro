import type { NextConfig } from "next";

/**
 * Standalone is enabled only for the Node/cPanel/Parspack path (`npm run build:node`).
 * Cloudflare/OpenNext (`npm run build`) keeps the default Next output so its
 * Worker packaging is unchanged.
 */
const useStandalone = process.env.NEXT_OUTPUT_STANDALONE === "1";

const nextConfig: NextConfig = {
  ...(useStandalone ? { output: "standalone" as const } : {}),
  // Static marketing/CRM imagery is local under /public.
  // Runtime uploads and third-party embeds do not go through next/image remote hosts.
  images: {
    remotePatterns: [],
  },
  // Faster local compiles for large icon/motion barrels (Next 15.5+).
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;

/**
 * OpenNext Cloudflare local bindings are opt-in for local development.
 * Ordinary `npm run dev` stays plain Next.js/Turbopack (JSON file store works
 * without Workers bindings). Set OPENNEXT_DEV=1 (or use `npm run dev:opennext`)
 * when you need Cloudflare binding emulation via Miniflare/Wrangler.
 *
 * Still skipped during `next build` / `next start` so the Node/Parspack path
 * does not boot Wrangler — and does not require @opennextjs/cloudflare.
 *
 * The module id is built at runtime (not a string literal) so TypeScript/Next
 * typechecking does not fail when optional Cloudflare packages are omitted.
 */
const openNextDevRequested =
  process.env.OPENNEXT_DEV === "1" || process.env.OPENNEXT_DEV === "true";

if (process.env.NODE_ENV === "development" && openNextDevRequested) {
  const openNextCloudflare = "@opennextjs/" + "cloudflare";
  void import(openNextCloudflare)
    .then((mod: { initOpenNextCloudflareForDev?: () => unknown }) => {
      mod.initOpenNextCloudflareForDev?.();
    })
    .catch((error: unknown) => {
      console.warn(
        "[next.config] OpenNext Cloudflare dev init skipped:",
        error instanceof Error ? error.message : error,
      );
    });
}
