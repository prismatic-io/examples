import AWS from "aws-sdk";
import { AuthorizationDefinition, Credential } from "@prismatic-io/spectral";

export const authorization: AuthorizationDefinition = {
  required: true,
  methods: ["api_key_secret"],
};

export const createSNSClient = async (
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

  const sts = new AWS.STS(credentials);
  try {
    await sts.getCallerIdentity({}).promise();
  } catch (err) {
    throw new Error(
      `Invalid AWS Credentials have been configured. This is sometimes caused by trailing spaces in AWS keys, missing characters from a copy/paste, etc. Original AWS error message: ${err.message}`
    );
  }
  return new AWS.SNS(credentials);
};
