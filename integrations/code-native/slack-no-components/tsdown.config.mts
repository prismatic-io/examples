import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { defineConfig } from "tsdown";

const ENV_FILE = ".env.local";
const REQUIRED_ENV_VARS = [
  "SLACK_CLIENT_ID",
  "SLACK_CLIENT_SECRET",
  "SLACK_SIGNING_SECRET",
];

// Fail the build if any required variable is missing from .env.local and process.env
const env = {
  ...process.env,
  ...(existsSync(ENV_FILE) ? parseEnv(readFileSync(ENV_FILE, "utf8")) : {}),
};
const missing = REQUIRED_ENV_VARS.filter((name) => !env[name]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}. Copy .env.example to ${ENV_FILE} and fill in your Slack app's credentials.`,
  );
}

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: "cjs",
  outDir: "dist",
  platform: "node",
  clean: true,
  dts: false,
  deps: {
    alwaysBundle: () => true,
    onlyBundle: false,
  },
  outExtensions: () => ({ js: ".js" }),
  outputOptions: { exports: "named" },
  loader: {
    ".md": "text",
  },
  // Inline SLACK_* values from .env.local (if present) at build time
  envFile: existsSync(ENV_FILE) ? ENV_FILE : undefined,
  envPrefix: "SLACK_",
  copy: [{ from: "assets/*", to: "dist" }],
});
