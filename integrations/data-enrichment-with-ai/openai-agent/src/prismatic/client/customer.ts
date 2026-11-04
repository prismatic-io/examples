import { CustomerClient, EmbeddedUserConfig } from "../types";
import { generateEmbeddedUserJWT } from "../auth/jwt";
import { authenticateEmbeddedUser } from "../auth/embedded";
import { executeGraphQLQuery } from "./graphql";

/**
 * Create a customer-scoped Prismatic client
 * @param signingKey - The signing key for JWT generation
 * @param userConfig - Configuration for the embedded user
 * @param apiUrl - The Prismatic API URL
 * @returns Promise that resolves to a CustomerClient
 */
export async function createCustomerClient(
  signingKey: string,
  userConfig: EmbeddedUserConfig,
  apiUrl = "https://app.prismatic.io/api",
): Promise<CustomerClient> {
  const jwtToken = generateEmbeddedUserJWT(userConfig, signingKey);

  // Authenticate the JWT token with Prismatic
  // This will also create the embedded user if they don't already exist
  const baseUrl = apiUrl.replace("/api", "");
  await authenticateEmbeddedUser(jwtToken, baseUrl);

  return {
    type: "customer",
    auth: jwtToken,
    apiUrl,
    customerId: userConfig.customer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: (graphql: string, variables?: any) =>
      executeGraphQLQuery(apiUrl, jwtToken, graphql, variables),
  };
}
