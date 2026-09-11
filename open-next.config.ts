import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext invokes buildCommand instead of `npm run build` (which is itself OpenNext).
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "npx next build",
};
