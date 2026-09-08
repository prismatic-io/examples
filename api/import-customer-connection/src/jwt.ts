import jsonwebtoken from "jsonwebtoken";
import fs from "node:fs";
import path from "path";

const currentTime = Math.floor(Date.now() / 1000);

interface GenerateJwtProps {
  sub: string;
  userName: string;
  organization: string;
  customerExternalId: string;
  customerName: string;
}

export const generateJwt = (props: GenerateJwtProps) => {
  const signingKey = fs.readFileSync(
    path.join(__dirname, "..", "private.key"),
    "utf8",
  );

  return jsonwebtoken.sign(
    {
      sub: props.sub,
      external_id: props.sub,
      name: props.userName,
      organization: props.organization,
      customer: props.customerExternalId,
      customer_name: props.customerName,
      iat: currentTime - 60,
      exp: currentTime + 60 * 60,
    },
    signingKey,
    { algorithm: "RS256" },
  );
};
