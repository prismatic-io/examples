import {
  configPage,
  configVar,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";
import {
  SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET,
  SLACK_SIGNING_SECRET,
} from "./slackConfig";

export const configPages = {
  Connections: configPage({
    tagline: "Authenticate with Slack",
    elements: {
      "Slack OAuth Connection": connectionConfigVar({
        stableKey: "slack-oauth-connection",
        dataType: "connection",
        connection: {
          component: "slack",
          key: "oauth2",
          values: {
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
          },
        },
      }),
    },
  }),
  "Slack Config": configPage({
    tagline: "Select a Slack channel from a dropdown menu",
    elements: {
      "Select Slack Channel": dataSourceConfigVar({
        stableKey: "select-slack-channel",
        dataSource: {
          component: "slack",
          key: "selectChannels",
          values: {
            connection: { configVar: "Slack OAuth Connection" },
            includePublicChannels: { value: true },
          },
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
