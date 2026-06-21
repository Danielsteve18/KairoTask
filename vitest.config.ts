import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tools"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "@supabase/ssr": path.resolve(__dirname, "node_modules/@supabase/ssr"),
    },
  },
});
