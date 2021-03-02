import AWS from "aws-sdk";
import { AuthorizationMethod, Credential } from "@prismatic-io/spectral";

export const authorizationMethods: AuthorizationMethod[] = ["api_key_secret"];

export const createS3Client = async (
  credential: Credential,
  region: string
) => {
  if (credential.authorizationMethod !== "api_key_secret") {
    throw new Error(
      `Unsupported authorization method ${credential.authorizationMethod}.`
    );
  }

  const credentials = {
    accessKeyId: credential.fields.api_key,
    secretAccessKey: credential.fields.api_secret,
    region,
  };

  // Verify credentials are valid with STS.getCallerIdentity()
  const sts = new AWS.STS(credentials);
  try {
    await sts.getCallerIdentity({}).promise();
  } catch (err) {
    throw new Error(
      `Invalid AWS Credentials have been configured. This is sometimes caused by trailing spaces in AWS keys, missing characters from a copy/paste, etc. Original AWS error message: ${err.message}`
    );
  }

  return new AWS.S3(credentials);
};
