import jsonwebtoken from "jsonwebtoken";

if (!process.env.PRISMATIC_SIGNING_KEY) {
  throw new Error(
    "PRISMATIC_SIGNING_KEY environment variable is not set. Please set it to generate tokens."
  );
}

const signingKey = process.env.PRISMATIC_SIGNING_KEY;

export const generateToken = () => {
  const currentTime = Math.floor(Date.now() / 1000);
  return jsonwebtoken.sign(
    {
      sub: `${process.env.PRISMATIC_CUSTOMER_SUB}`,
      external_id: `${process.env.PRISMATIC_CUSTOMER_SUB}`,
      name: "John Doe",
      organization: `${process.env.PRISMATIC_ORGANIZATION_ID}`,
      customer: `${process.env.PRISMATIC_CUSTOMER_EXTERNAL_ID}`,
      nbf: currentTime,
      iat: currentTime,
      exp: currentTime + 60 * 60 * 4, // 4 hours
      role: "admin",
    },
    signingKey, // Store this somewhere safe
    { algorithm: "RS256" }
  );
};
