import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 5 * 60 * 1000, // 5 minutes
  },
});
