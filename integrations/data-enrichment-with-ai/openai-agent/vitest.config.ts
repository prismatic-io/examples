import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { defineConfig } from "vitest/config";

// Make values from .env (if present) available to tests via process.env
const env = existsSync(".env")
  ? (parseEnv(readFileSync(".env", "utf8")) as Record<string, string>)
  : {};

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    env,
    // Tests call the live OpenAI API, so allow plenty of time
    testTimeout: 300000,
  },
});
