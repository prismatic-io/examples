import {
  configPage,
  configVar,
  connectionConfigVar,
} from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "",
    elements: {
      "Slack Connection": connectionConfigVar({
        stableKey: "slackConnection",
        dataType: "connection",
        connection: {
          component: "slack",
          key: "oauth2",
          values: {
            authorizeUrl: {
              value: "https://slack.com/oauth/v2/authorize",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            clientId: {
              value: process.env.SLACK_CLIENT_ID || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
            clientSecret: {
              value: process.env.SLACK_CLIENT_SECRET || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
            isUser: {
              value: false,
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            revokeUrl: {
              value: "https://slack.com/api/auth.revoke",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            scopes: {
              value:
                "app_mentions:read commands chat:write im:history assistant:write",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            signingSecret: {
              value: process.env.SLACK_SIGNING_SECRET || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
            tokenUrl: {
              value: "https://slack.com/api/oauth.v2.access",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
          },
        },
      }),
      OPENAI_API_KEY: connectionConfigVar({
        label: "OPENAI API Key",
        iconPath: "./assets/icon.png",
        stableKey: "a249ac69-48f2-4e99-84d0-abc234123123",
        dataType: "connection",
        inputs: {
          apiKey: {
            label: "API Key",
            placeholder: "sk-proj-Csg...",
            type: "password",
            required: true,
            shown: true,
            default: "",
          },
        },
      }),
    },
  }),
  Prompts: configPage({
    tagline: "",
    elements: {
      Header: "<h3>Setup Prompts</h3>",
      SYSTEM_PROMPT: configVar({
        stableKey: "1F886045-27E7-452B-9B44-776863F6A862",
        dataType: "string",
        description: "The agent's system prompt",
        defaultValue:
          "You are a helpful AI assistant. Answer questions clearly and concisely. Be friendly and professional in your responses.",
      }),
    },
  }),
};