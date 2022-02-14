import {
  connection,
  oauth2Connection,
  OAuth2Type,
} from "@prismatic-io/spectral";

export const slackOAuth = oauth2Connection({
  oauth2Type: OAuth2Type.AuthorizationCode,
  key: "oauth2",
  label: "Slack OAuth 2.0",
  comments:
    "Authenticate requests to Slack using values obtained from the developer console.",
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: false,
      comments: "The OAuth 2.0 Authorization URL for Slack",
      default: "https://slack.com/oauth/authorize",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Token URL for Slack",
      default: "https://slack.com/api/oauth.access",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: true,
      shown: true,
      default: "",
      comments:
        "A space-delimited set of one or more scopes to get the user's permission to access.",
    },
    clientId: {
      label: "Client Id",
      placeholder: "Client Id",
      type: "string",
      required: true,
      shown: true,
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "Client Secret",
      type: "string",
      required: true,
      shown: true,
    },
    signingSecret: {
      label: "Signing Secret",
      placeholder: "Signing Secret",
      type: "string",
      required: true,
      shown: true,
    },
  },
});
export const webhookUrlConnection = connection({
  key: "webhookUrl",
  label: "Webhook URL",
  comments: "Slack Webhook URL hosting",
  inputs: {
    webhookUrl: {
      label: "Webhook URL",
      placeholder: "Slack Webhook URL",
      type: "string",
      required: true,
      comments:
        "The Slack webhook URL. Instructions for generating a Slack webhook are available on the Slack component docs page.",
      example: "https://hooks.slack.com/services/TXXXX/BXXXXX/XXXXXXX",
    },
  },
});

export default [slackOAuth, webhookUrlConnection];
