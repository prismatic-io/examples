// import fetch from "node-fetch";

/**
 * Authenticate the JWT token with Prismatic's embedded API
 * @param token - The JWT token to authenticate
 * @param baseUrl - The base Prismatic URL
 * @returns Promise that resolves if authentication is successful
 */
export async function authenticateEmbeddedUser(
  token: string,
  baseUrl = "https://app.prismatic.io",
): Promise<void> {
  const response = await fetch(`${baseUrl}/embedded/authenticate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }
}
