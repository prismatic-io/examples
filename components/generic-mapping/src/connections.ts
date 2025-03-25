import {
  connection,
  oauth2Connection,
  OAuth2Type,
} from "@prismatic-io/spectral";
export const apiKey = connection({
  key: "apiKey",
  display: {
    label: "API Key",
    description: "API Key connection",
  },
  inputs: {
    apiKey: {
      label: "API Key",
      placeholder: "API Key",
      type: "password",
      required: true,
      shown: true,
      comments: "API Key",
    },
  },
});
export const oauth = oauth2Connection({
  key: "oauth",
  display: {
    label: "OAuth 2.0 Connection",
    description: "OAuth 2.0 Connection",
  },
  oauth2Type: OAuth2Type.AuthorizationCode,
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Authorization URL for the API",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Token URL for the API",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: false,
      shown: true,
      comments: "Space separated OAuth 2.0 permission scopes for the API",
      default: "",
    },
    clientId: {
      label: "Client ID",
      placeholder: "Client ID",
      type: "string",
      required: true,
      shown: true,
      comments: "Client Identifier of your app for the API",
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "Client Secret",
      type: "password",
      required: true,
      shown: true,
      comments: "Client Secret of your app for the API",
    },
    headers: {
      label: "Headers",
      type: "string",
      collection: "keyvaluelist",
      required: false,
      shown: true,
      comments: "Additional header to supply to authorization requests",
    },
  },
});

export default [oauth, apiKey];
