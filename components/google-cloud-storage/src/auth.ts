/* eslint-disable @typescript-eslint/camelcase */
import { Storage } from "@google-cloud/storage";
import { AuthorizationMethod, Credential } from "@prismatic-io/spectral";

export const authorizationMethods: AuthorizationMethod[] = ["private_key"];

export const googleStorageClient = (credential: Credential, project) => {
  if (credential.authorizationMethod !== "private_key") {
    throw new Error(
      `Unsupported authorization method ${credential.authorizationMethod}.`
    );
  }

  const client_email = credential.fields.username;
  const private_key = credential.fields.private_key.replace(/\\n/g, "\n");
  return new Storage({
    projectId: project,
    credentials: {
      client_email,
      private_key,
    },
  });
};
