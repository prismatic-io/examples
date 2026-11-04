import { OrganizationClient } from "../types";
import { exchangeRefreshToken } from "../auth/refresh";
import { executeGraphQLQuery } from "./graphql";

/**
 * Create an organization-scoped Prismatic client
 * @param refreshToken - The refresh token for authentication
 * @param apiUrl - The Prismatic API URL
 * @returns Promise that resolves to an OrganizationClient
 */
export async function createOrganizationClient(
  refreshToken: string,
  apiUrl = "https://app.prismatic.io/api",
): Promise<OrganizationClient> {
  const accessToken = await exchangeRefreshToken(refreshToken, apiUrl);

  return {
    type: "organization",
    auth: accessToken,
    apiUrl,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: (graphql: string, variables?: any) =>
      executeGraphQLQuery(apiUrl, accessToken, graphql, variables),
  };
}
