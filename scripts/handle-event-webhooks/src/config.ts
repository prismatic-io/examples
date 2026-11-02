/**
 * Configuration module for environment variables
 * and application settings.
 * Reads from process.env (a .env file, if present, is loaded by
 * Node's --env-file-if-exists flag in the npm scripts)
 */

interface Config {
  /** Port number for the server to listen on */
  port: number;
  /** Production or development environment */
  nodeEnv: string;
  /** HMAC signing secret for verifying webhook payloads */
  signingSecret: string;
  /** Path to the SQLite database file */
  dbFile: string;
  /** Prismatic API URL */
  prismaticApiUrl: string;
  /** Prismatic API token */
  prismaticApiToken: string;
}

if (!process.env.SIGNING_SECRET) {
  throw new Error("SIGNING_SECRET environment variable is required");
}

if (!process.env.PRISMATIC_API_URL) {
  throw new Error("PRISMATIC_API_URL environment variable is required");
}

if (!process.env.PRISMATIC_API_TOKEN) {
  throw new Error("PRISMATIC_API_TOKEN environment variable is required");
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  signingSecret: process.env.SIGNING_SECRET,
  dbFile: process.env.DB_FILE || "webhooks.sqlite",
  prismaticApiUrl: process.env.PRISMATIC_API_URL,
  prismaticApiToken: process.env.PRISMATIC_API_TOKEN,
};

export default config;
