import { configPage, configVar, reference } from "@prismatic-io/spectral";
import { Components } from "./components";

export const configPages = {
  Connections: configPage({
    tagline: "Authenticate with Slack",
    elements: {
      "Slack OAuth Connection": reference<Components>().connection({
        stableKey: "slack-connection",
        connection: {
          component: "slack",
          key: "oauth2",
          values: {
            clientId: { value: "REPLACE_ME_WITH_CLIENT_ID" },
            clientSecret: { value: "REPLACE_ME_WITH_CLIENT_SECRET" },
            signingSecret: { value: "REPLACE_ME_WITH_SIGNING_SECRET" },
            scopes: { value: "chat:write chat:write.public channels:read" },
          },
        },
      }),
    },
  }),
  "Slack Config": configPage({
    tagline: "Select a Slack channel from a dropdown menu",
    elements: {
      "Select Slack Channel": reference<Components>().dataSource({
        stableKey: "slack-channel",
        dataSourceType: "picklist",
        dataSource: {
          component: "slack",
          key: "selectChannels",
          values: {
            connection: { configVar: "Slack OAuth Connection" },
            includePublicChannels: { value: "true" },
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

export type ConfigPages = typeof configPages;
