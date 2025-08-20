import fetch from "node-fetch";

/**
 * Execute a GraphQL query against the Prismatic API
 * @param apiUrl - The API endpoint URL
 * @param authToken - The authentication token (JWT or access token)
 * @param query - The GraphQL query string
 * @param variables - Optional query variables
 * @returns The data from the GraphQL response
 */
export async function executeGraphQLQuery(
  apiUrl: string,
  authToken: string,
  query: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const result = await response.json();
    const gqlErrors = result.errors;
    throw new Error(`GraphQL request failed: ${JSON.stringify(gqlErrors)}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}
