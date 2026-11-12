import { configPage, configVar } from "@prismatic-io/spectral";
import slack from "@prismatic-io/components-slack";

export const configPages = {
  Connections: configPage({
    tagline: "Authenticate with Slack",
    elements: {
      "Slack OAuth Connection": slack.connections.oauth2({
        stableKey: "slack-oauth-connection",
        values: {
          clientId: {
            value: process.env.SLACK_CLIENT_ID,
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          clientSecret: {
            value: process.env.SLACK_CLIENT_SECRET,
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          signingSecret: {
            value: process.env.SLACK_SIGNING_SECRET,
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          scopes: {
            value: "chat:write chat:write.public channels:read",
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          authorizeUrl: {
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          isUser: {
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          tokenUrl: {
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
          revokeUrl: {
            permissionAndVisibilityType: "organization",
            visibleToOrgDeployer: false,
          },
        },
      }),
    },
  }),
  "Slack Config": configPage({
    tagline: "Select a Slack channel from a dropdown menu",
    elements: {
      "Select Slack Channel": slack.dataSources.selectChannels({
        stableKey: "select-slack-channel",
        values: {
          connection: { configVar: "Slack OAuth Connection" },
          includePublicChannels: { value: true },
        },
      }),
    },
  }),
  "Other Config": configPage({
    elements: {
      "Acme API Endpoint": configVar({
        stableKey: "acme-api-endpoint",
        dataType: "string",
        description: "The endpoint to fetch TODO items from Acme",
        defaultValue: "https://jsonplaceholder.typicode.com/todos?_limit=10",
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
