import {
  connection,
  oauth2Connection,
  OAuth2Type,
} from "@prismatic-io/spectral";

export const asanaApiKeyConnection = connection({
  key: "apiKey",
  label: "Asana Personal Access Token",
  inputs: {
    apiKey: {
      label: "Personal Access Token",
      placeholder: "Personal Access Token",
      type: "string",
      required: true,
      shown: true,
      comments:
        "Log in to https://app.asana.com/0/my-apps to fetch a personal access token for development purposes",
      example: "1/example",
    },
  },
});

export const asanaOAuthConnection = oauth2Connection({
  oauth2Type: OAuth2Type.AuthorizationCode,
  key: "oauth2",
  label: "Asana OAuth 2.0 Connection",
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: false,
      comments: "The OAuth 2.0 Authorization URL for Asana",
      default: "https://app.asana.com/-/oauth_authorize",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: false,
      comments: "The OAuth 2.0 Token URL for Asana",
      default: "https://app.asana.com/-/oauth_token",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: false,
      shown: false,
      comments: "Asana does not support granular scopes.",
      default: "",
    },
    clientId: {
      label: "Client ID",
      placeholder: "Client ID",
      type: "string",
      required: true,
      shown: true,
      comments: "Generate from https://app.asana.com/0/my-apps/",
    },
    clientSecret: {
      label: "Client secret",
      placeholder: "Client secret",
      type: "password",
      required: true,
      shown: true,
      comments: "Generate from https://app.asana.com/0/my-apps/",
    },
  },
});

export default [asanaOAuthConnection, asanaApiKeyConnection];
