import {
  ConfigVarDataType,
  configPage,
  configVar,
} from "@prismatic-io/spectral";
import { slackConnectionConfigVar } from "./connections";
import { slackSelectChannelDataSource } from "./dataSources";

export const configPages = {
  Connections: configPage({
    tagline: "Authenticate with Slack",
    elements: {
      "Slack OAuth Connection": slackConnectionConfigVar,
    },
  }),
  "Slack Config": configPage({
    tagline: "Select a Slack channel from a dropdown menu",
    elements: {
      "Select Slack Channel": slackSelectChannelDataSource,
    },
  }),
  "Other Config": configPage({
    elements: {
      "Acme API Endpoint": configVar({
        stableKey: "1F886045-27E7-452B-9B44-776863F6A862",
        dataType: ConfigVarDataType.String,
        description: "The endpoint to fetch TODO items from Acme",
        defaultValue:
          "https://my-json-server.typicode.com/prismatic-io/placeholder-data/todo",
      }),
      "Webhook Config Endpoint": configVar({
        stableKey: "webhook-config-endpoint",
        dataType: ConfigVarDataType.String,
        description:
          "The endpoint to call when deploying or deleting an instance",
      }),
    },
  }),
};
