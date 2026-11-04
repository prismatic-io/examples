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
    // pg optionally requires pg-native and cloudflare:sockets; leave them unbundled
    neverBundle: ["pg-native", "cloudflare:sockets"],
  },
  outExtensions: () => ({ js: ".js" }),
  // AWS SDK dynamically imports bowser; keep everything in a single index.js
  outputOptions: { exports: "named", codeSplitting: false },
  loader: {
    ".md": "text",
  },
  copy: [{ from: "assets/*", to: "dist" }],
});
