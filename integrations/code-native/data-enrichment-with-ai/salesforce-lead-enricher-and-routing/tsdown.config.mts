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
  copy: [{ from: "assets/*", to: "dist" }],
});
