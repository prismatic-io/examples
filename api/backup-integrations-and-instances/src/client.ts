import { GraphQLClient } from "graphql-request";
import fetchRetry from "fetch-retry";
import { PRISMATIC_API_ENDPOINT } from "./config";

/**
 * Set up GraphQL Client. You must set a PRISMATIC_API_KEY environment variable.
 * For example, run
 *   PRISMATIC_API_KEY=$(prism me:token) npm run start
 */
export const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient(PRISMATIC_API_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${PRISMATIC_API_KEY}`,
  },
  fetch: fetchRetry(fetch, {
    retries: 5,
    retryDelay: 800,
  }),
});

export default client;
