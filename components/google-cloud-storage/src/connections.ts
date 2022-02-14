import { connection } from "@prismatic-io/spectral";

export const googleConnection = connection({
  key: "privateKey",
  label: "Google Cloud Storage Private Key",
  comments:
    "Authenticate requests to Google Cloud Storage using values obtained from the Google Cloud Platform.",
  inputs: {
    clientEmail: {
      label: "Client Email",
      placeholder: "Client Email",
      type: "string",
      required: true,
      example: "someone@example.com",
      shown: true,
      comments: "The email address of the client you would like to connect.",
    },
    privateKey: {
      label: "Private Key",
      placeholder: "Private Key",
      type: "string",
      required: true,
      shown: true,
      comments: "The private key of the client you would like to connect.",
    },
    projectId: {
      label: "Project Id",
      placeholder: "Project Id",
      type: "string",
      required: true,
      shown: true,
      comments:
        "A space-delimited set of one or more scopes to get the user's permission to access.",
    },
  },
});

export default [googleConnection];
