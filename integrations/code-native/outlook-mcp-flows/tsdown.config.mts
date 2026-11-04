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
  outputOptions: { exports: "named" },
  loader: {
    ".md": "text",
  },
  // Inline MICROSOFT_* values from .env (if present) at build time
  envFile: existsSync(".env") ? ".env" : undefined,
  envPrefix: "MICROSOFT_",
  copy: [{ from: "assets/*", to: "dist" }],
});
