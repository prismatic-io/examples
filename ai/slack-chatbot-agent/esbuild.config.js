const esbuild = require("esbuild");
const fs = require("fs-extra");
const path = require("path");

async function build() {
  console.log("Building with esbuild...");

  // Ensure dist directory exists
  await fs.ensureDir("dist");

  // Copy assets
  console.log("Copying assets...");
  await fs.copy("assets", "dist");

  // Build with esbuild
  console.log("Bundling TypeScript files...");
  await esbuild.build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    platform: "node",
    target: "node22",
    format: "cjs",
    outfile: "dist/index.js",
    minify: true,
    // Handle the OpenAI agents module format issues
    mainFields: ["main"],
    conditions: ["node"],
    // Ensure all dependencies are bundled
    packages: "bundle",
    // Add source maps for debugging
    sourcemap: false,
    // Show build info
    logLevel: "info",
  });

  console.log("Build complete!");
}

build().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
