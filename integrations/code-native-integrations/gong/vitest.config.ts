import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import { loadEnv } from "vite";

// Load .env file
dotenv.config();

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    env: loadEnv("", process.cwd(), ""),
  },
});