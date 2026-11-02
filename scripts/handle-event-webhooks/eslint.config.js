import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["src/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
