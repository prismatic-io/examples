import {
  connection,
  oauth2Connection,
  OAuth2Type,
} from "@prismatic-io/spectral";

export const googleOAuthConnection = oauth2Connection({
  oauth2Type: OAuth2Type.AuthorizationCode,
  key: "googleOAuth",
  label: "Google OAuth 2.0",
  comments:
    "Authenticate requests to Google Cloud Storage using Google OAuth 2.0",
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: false,
      default:
        "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: false,
      default: "https://oauth2.googleapis.com/token",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: true,
      shown: true,
      default: "https://www.googleapis.com/auth/devstorage.read_write",
    },
    clientId: {
      label: "Client ID",
      placeholder: "Client ID",
      type: "string",
      required: true,
      shown: true,
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "Client Secret",
      type: "password",
      required: true,
      shown: true,
    },
    projectId: {
      label: "Project Id",
      placeholder: "Project Id",
      type: "string",
      required: true,
      shown: true,
      comments: "The ID of the project that hosts the storage bucket",
    },
  },
});

export const googlePrivateKeyConnection = connection({
  key: "privateKey",
  label: "Google Cloud Storage Private Key",
  inputs: {
    clientEmail: {
      label: "Client Email",
      placeholder: "Client Email",
      type: "string",
      required: true,
      shown: true,
      comments: "The email address of the client you would like to connect.",
    },
    privateKey: {
      label: "Private Key",
      placeholder: "Private Key",
      type: "text",
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
      comments: "The ID of the project that hosts the storage bucket",
    },
  },
});

export default [googleOAuthConnection, googlePrivateKeyConnection];
