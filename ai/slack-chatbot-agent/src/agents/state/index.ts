import { OrganizationClient, CustomerClient } from "../../prismatic/types";
import { StateStorage } from "./types";
import { FileStorage } from "./fileStorage";
import { PrismaticStorage } from "./prismaticStorage";

export * from "./types";
export { FileStorage } from "./fileStorage";
export { PrismaticStorage } from "./prismaticStorage";

export interface StorageConfig {
  type: "prismatic" | "db";
  basePath?: string; // For file storage
  client?: OrganizationClient | CustomerClient; // For prismatic storage
}

export function createStateStorage(config: StorageConfig): StateStorage {
  if (config.type === "db") {
    // Mock a db with files for local testing
    // This is where you would integrate with a real database
    return new FileStorage(config.basePath);
  }

  if (!config.client) {
    throw new Error("Prismatic storage requires a client");
  }

  return new PrismaticStorage(config.client);
}
