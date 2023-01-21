// Copied from the Jira component for testing purposes

import {
  connection,
  oauth2Connection,
  OAuth2Type,
} from "@prismatic-io/spectral";

export const jiraBasicConnection = connection({
  key: "basic",
  label: "Jira Basic Connection",
  inputs: {
    username: {
      label: "Username",
      placeholder: "Username",
      type: "string",
      required: true,
      shown: true,
      comments:
        "Provide a valid username for the given jira account you want to connect.",
      example: "exampleUser",
    },
    password: {
      label: "API Key/Password",
      placeholder: "API Key/Password",
      type: "string",
      required: true,
      shown: true,
      comments:
        "Provide a password to authenticate all requests with. Cloud users need to generate an API token for this value.",
      example: "exampleSecurePassword",
    },
    host: {
      label: "Host",
      placeholder: "Host",
      type: "string",
      required: true,
      shown: true,
      comments: "Provide a string value for the URL of your Jira account.",
      example: "example.atlassian.net",
    },
    version: {
      label: "Version",
      placeholder: "Version",
      type: "string",
      required: true,
      shown: true,
      comments:
        "Provide a string value for the version of your Jira API request",
      example: "2",
    },
  },
});

export const jiraOAuthConnection = oauth2Connection({
  oauth2Type: OAuth2Type.AuthorizationCode,
  key: "oauth2",
  label: "Jira OAuth 2.0 Connection",
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Authorization URL for Jira",
      default:
        "https://auth.atlassian.com/authorize?audience=api.atlassian.com&prompt=consent",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Token URL for Jira",
      default: "https://auth.atlassian.com/oauth/token",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: true,
      shown: true,
      default:
        "read:project:jira read:user:jira write:issue:jira read:issue:jira read:issue-link:jira write:issue-link:jira read:issue-link-type:jira write:issue-link-type:jira read:issue.transition:jira delete:issue:jira offline_access",
      comments:
        "A space-delimited set of one or more scopes to get the user's permission to access.",
    },
    clientId: {
      label: "Client ID",
      placeholder: "Client ID",
      type: "string",
      required: true,
      shown: true,
      example: "c9e4APadFFkbtTycoNtrHKBtYgUyZWy",
    },
    clientSecret: {
      label: "Client Secret",
      placeholder: "Client Secret",
      type: "password",
      required: true,
      shown: true,
      example: "ntDBx4ao5czkFu7Mzp5FTlYG0y3_ukxkSiPhwnTkhsdKHJITGRCGP3ZWlXTYyu",
    },
    version: {
      label: "Version",
      placeholder: "Version",
      type: "string",
      required: true,
      shown: true,
      comments:
        "Provide a string value for the version of your Jira API request",
      default: "2",
      example: "2",
    },
  },
});

export default [jiraOAuthConnection, jiraBasicConnection];
