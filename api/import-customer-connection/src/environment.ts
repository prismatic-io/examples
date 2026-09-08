import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const getEnvironmentVariables = () => {
  const PRISMATIC_ORGANIZATION_ID = process.env.PRISMATIC_ORGANIZATION_ID;
  const PRISMATIC_BASE_URL = process.env.PRISMATIC_BASE_URL;
  const CONNECTION_STABLE_KEY = process.env.CONNECTION_STABLE_KEY;

  if (!PRISMATIC_ORGANIZATION_ID) {
    throw new Error(
      "PRISMATIC_ORGANIZATION_ID environment variable is not set.",
    );
  }

  if (!PRISMATIC_BASE_URL) {
    throw new Error("PRISMATIC_BASE_URL environment variable is not set.");
  }

  if (!CONNECTION_STABLE_KEY) {
    throw new Error("CONNECTION_STABLE_KEY environment variable is not set.");
  }

  return {
    PRISMATIC_ORGANIZATION_ID,
    PRISMATIC_BASE_URL,
    CONNECTION_STABLE_KEY,
  };
};

export default getEnvironmentVariables;
