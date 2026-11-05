import { existsSync } from "node:fs";
import { defineConfig } from "tsdown";

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
  // Emit a single bundle (inline dynamic imports from @openai/agents and @slack/bolt)
  outputOptions: { exports: "named", codeSplitting: false },
  // Inline SLACK_*, OPENAI_* and PRISMATIC_* values from .env (if present) at build time.
  // These become the default values of the config wizard inputs in src/configPages.ts.
  envFile: existsSync(".env") ? ".env" : undefined,
  envPrefix: ["SLACK_", "OPENAI_", "PRISMATIC_"],
  copy: [{ from: "assets/*", to: "dist" }],
});
