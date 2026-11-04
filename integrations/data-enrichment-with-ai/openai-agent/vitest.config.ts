import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Handle both CommonJS and ESM modules
    env: loadEnv("", process.cwd(), ""),

    deps: {
      interopDefault: true,
    },
  },
  resolve: {
    alias: {
      // Remove .js extensions in imports
      "@": "/src",
    },
  },
  // Ensure TypeScript files are processed
  esbuild: {
    target: "node18",
  },
});
