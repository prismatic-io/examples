import { oauth2Connection, OAuth2Type } from "@prismatic-io/spectral";

export const oauthConnection = oauth2Connection({
  key: "oauth",
  label: "OAuth 2.0",
  oauth2Type: OAuth2Type.AuthorizationCode,
  comments: "OAuth 2.0 Connectivity for Dropbox",
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: false,
      comments: "The OAuth 2.0 Authorization URL for Dropbox",
      default:
        "https://www.dropbox.com/oauth2/authorize?token_access_type=offline",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: false,
      comments: "The OAuth 2.0 Token URL for Dropbox",
      default: "https://api.dropboxapi.com/oauth2/token",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: false,
      shown: false,
      comments:
        "Dropbox permission scopes are set within Dropbox on the OAuth application",
      default: "",
    },
    clientId: {
      label: "App Key",
      placeholder: "App Key",
      type: "string",
      required: true,
      shown: true,
      comments: "Generate at https://www.dropbox.com/developers/apps",
    },
    clientSecret: {
      label: "App Secret",
      placeholder: "App Secret",
      type: "password",
      required: true,
      shown: true,
      comments: "Generate at https://www.dropbox.com/developers/apps",
    },
  },
});
