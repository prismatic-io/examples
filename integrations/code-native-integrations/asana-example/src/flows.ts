import { flow } from "@prismatic-io/spectral";
import { createAsanaClient } from "./client";

export const printCurrentUser = flow({
  name: "Print Current User",
  stableKey: "print-current-user",
  description: "This is the first flow",
  onExecution: async ({ configVars, logger }, params) => {
    const asanaClient = await createAsanaClient(configVars["Asana API Key"]);
    const { data } = await asanaClient.get("/users/me");
    logger.info(`Currently logged in as ${data.data.email}`);
    return { data };
  },
});

export default [printCurrentUser];
