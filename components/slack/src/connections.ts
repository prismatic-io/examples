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
      shown: true,
      comments: `The OAuth 2.0 Authorization URL for Slack. If you want to request access to the API on behalf of a user, append a 'user_scope' query parameter to the end of the Authorize URL: https://slack.com/oauth/v2/authorize?user_scope=chat:write`,
      default: "https://slack.com/oauth/v2/authorize",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Token URL for Slack",
      default: "https://slack.com/api/oauth.v2.access",
    },
    revokeUrl: {
      label: "Revoke URL",
      placeholder: "Revoke URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Revocation URL for Slack",
      default: "https://slack.com/api/auth.revoke",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: true,
      shown: true,
      default:
        "chat:write chat:write.public chat:write.customize channels:read groups:read im:read mpim:read",
      example:
        "chat:write chat:write.public users:read channels:read files:read files:write channels:write channels:history groups:history mpim:history im:history",
      comments:
        "A space-delimited set of one or more scopes to get the user's permission to access.",
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
    signingSecret: {
      label: "Signing Secret",
      placeholder: "Signing Secret",
      type: "password",
      required: true,
      shown: true,
    },
    isUser: {
      label: "Is User",
      type: "boolean",
      required: true,
      default: "false",
      comments: `Flip the flag to true if you want to access the API as a user. If flipped you must also provide a 'user_scope' query parameter to the end of the Authorize URL. Leaving the flag false will grant you a bot token instead.`,
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
