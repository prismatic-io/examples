import fetch from "node-fetch";

/**
 * Exchange a refresh token for an access token
 * @param refreshToken - The refresh token
 * @param apiUrl - The Prismatic API URL (defaults to https://app.prismatic.io/api)
 * @returns Promise that resolves to the access token
 */
export async function exchangeRefreshToken(
  refreshToken: string,
  apiUrl = "https://app.prismatic.io/api",
): Promise<string> {
  // Remove /api from the URL for auth endpoints
  const authUrl = apiUrl.replace("/api", "");
  const response = await fetch(`${authUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("No access token received from refresh endpoint");
  }

  return data.access_token;
}
