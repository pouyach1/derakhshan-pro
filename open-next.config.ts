import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// buildCommand must call Next directly — OpenNext runs `npm run build` by default,
// and our package.json `build` script is `opennextjs-cloudflare build`.
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "npx next build",
};
