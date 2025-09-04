import { configPage, configVar } from "@prismatic-io/spectral";
import { slackOauth2 } from "./manifests/slack/connections/oauth2";
import { slackSelectChannels } from "./manifests/slack/dataSources/selectChannels";
import {
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
} from "./slackConfig";

export const configPages = {
  Connections: configPage({
    tagline: "Authenticate with Slack",
    elements: {
      "Slack OAuth Connection": slackOauth2("slack-oauth-connection", {
        clientId: {
          value: SLACK_CLIENT_ID,
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        clientSecret: {
          value: SLACK_CLIENT_SECRET,
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        signingSecret: {
          value: SLACK_SIGNING_SECRET,
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        scopes: {
          value: "chat:write chat:write.public channels:read",
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        // @ts-ignore (use default value; will be optional in future)
        authorizeUrl: {
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        // @ts-ignore (use default value; will be optional in future)
        isUser: {
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        // @ts-ignore (use default value; will be optional in future)
        tokenUrl: {
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
        // @ts-ignore
        revokeUrl: {
          permissionAndVisibilityType: "organization",
          visibleToOrgDeployer: false,
        },
      }),
    },
  }),
  "Slack Config": configPage({
    tagline: "Select a Slack channel from a dropdown menu",
    elements: {
      "Select Slack Channel": slackSelectChannels("select-slack-channel", {
        connection: { configVar: "Slack OAuth Connection" },
        includePublicChannels: { value: true },
      }),
    },
  }),
  "Other Config": configPage({
    elements: {
      "Acme API Endpoint": configVar({
        stableKey: "acme-api-endpoint",
        dataType: "string",
        description: "The endpoint to fetch TODO items from Acme",
        defaultValue:
          "https://my-json-server.typicode.com/prismatic-io/placeholder-data/todo",
      }),
      "Webhook Config Endpoint": configVar({
        stableKey: "webhook-config-endpoint",
        dataType: "string",
        description:
          "The endpoint to call when deploying or deleting an instance",
      }),
    },
  }),
};
