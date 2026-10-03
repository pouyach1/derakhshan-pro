import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: false,
    environment: "node",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e/**", "tests/e2e/**"],
    environmentMatchGlobs: [
      ["tests/component/**", "jsdom"],
      ["**/*.component.test.tsx", "jsdom"],
    ],
    pool: "forks",
    fileParallelism: false,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      reportsDirectory: "./coverage",
      include: [
        "src/server/**/*.{ts,tsx}",
        "src/app/api/**/*.{ts,tsx}",
        "src/app/sitemap.ts",
        "src/app/robots.ts",
        "src/middleware.ts",
        "src/components/auth/**/*.{ts,tsx}",
        "src/components/ui/Button.tsx",
        "src/components/mobile/BottomSheet.tsx",
        "src/components/blog/admin/BlogDeleteButton.tsx",
        "src/components/navigation/Navbar.tsx",
      ],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/.next/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
