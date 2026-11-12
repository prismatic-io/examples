import { existsSync } from "node:fs";
import { defineConfig } from "vitest/config";

// Load GONG_* credentials from .env (if present) for the live API tests
if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
});
