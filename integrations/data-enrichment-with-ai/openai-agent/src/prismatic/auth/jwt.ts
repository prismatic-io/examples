import jwt from "jsonwebtoken";
import { EmbeddedUserConfig } from "../types";

/**
 * Generate an embedded user JWT for Prismatic authentication
 * @param userConfig - Configuration for the embedded user
 * @param signingKey - The signing key for JWT generation
 * @returns JWT token string
 */
export function generateEmbeddedUserJWT(
  userConfig: EmbeddedUserConfig,
  signingKey: string,
): string {
  const currentTime = Math.floor(Date.now() / 1000);

  const payload = {
    sub: userConfig.sub,
    organization: userConfig.organization,
    customer: userConfig.customer,
    external_id: userConfig.external_id || userConfig.sub,
    name: userConfig.name,
    customer_name: userConfig.customer_name,
    role: userConfig.role || "admin",
    iat: currentTime,
    exp: currentTime + 3600, // 1 hour expiration
  };

  // Remove undefined fields
  Object.keys(payload).forEach((key) => {
    if (payload[key as keyof typeof payload] === undefined) {
      delete payload[key as keyof typeof payload];
    }
  });

  // Sign with RS256 algorithm
  const token = jwt.sign(payload, signingKey, {
    algorithm: "RS256",
  });

  return token;
}
