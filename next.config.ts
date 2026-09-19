import type { NextConfig } from "next";

/**
 * Standalone is enabled only for the Node/cPanel path (`npm run build:node`).
 * Cloudflare/OpenNext (`npm run build`) keeps the default Next output so its
 * Worker packaging is unchanged.
 */
const useStandalone = process.env.NEXT_OUTPUT_STANDALONE === "1";

const nextConfig: NextConfig = {
  ...(useStandalone ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

/**
 * OpenNext Cloudflare local bindings are only needed for `next dev`.
 * Skip during `next build` / `next start` so the Node/cPanel path does not
 * boot Wrangler/Miniflare. Cloudflare production still uses OpenNext + wrangler.
 */
if (process.env.NODE_ENV === "development") {
  void import("@opennextjs/cloudflare")
    .then(({ initOpenNextCloudflareForDev }) => {
      initOpenNextCloudflareForDev();
    })
    .catch((error) => {
      console.warn(
        "[next.config] OpenNext Cloudflare dev init skipped:",
        error instanceof Error ? error.message : error,
      );
    });
}
