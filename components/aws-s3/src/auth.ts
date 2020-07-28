import AWS from "aws-sdk";
import { AuthorizationMethod, Credential } from "@prismatic-io/spectral";

export const authorizationMethods: AuthorizationMethod[] = ["api_key_secret"];

export const createS3Client = (credential: Credential, region) => {
  const accessKeyId = credential.fields.api_key;
  const secretAccessKey = credential.fields.api_secret;
  return new AWS.S3({
    apiVersion: "2006-03-01",
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });
};
