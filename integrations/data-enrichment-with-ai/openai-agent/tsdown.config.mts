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
  // Emit a single bundle (inline dynamic imports from @openai/agents)
  outputOptions: { exports: "named", codeSplitting: false },
  // Inline PRISMATIC_* values (e.g. PRISMATIC_REFRESH_TOKEN) from .env (if present) at build time
  envFile: existsSync(".env") ? ".env" : undefined,
  envPrefix: "PRISMATIC_",
  copy: [{ from: "assets/*", to: "dist" }],
});
