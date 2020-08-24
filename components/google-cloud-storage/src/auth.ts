/* eslint-disable @typescript-eslint/camelcase */
import { Storage } from "@google-cloud/storage";
import { AuthorizationMethod, Credential } from "@prismatic-io/spectral";

export const authorizationMethods: AuthorizationMethod[] = ["private_key"];

export const googleStorageClient = (credential: Credential, project) => {
  const client_email = credential.fields.username;
  const private_key = credential.fields.private_key;
  return new Storage({
    projectId: project,
    credentials: {
      client_email,
      private_key,
    },
  });
};
