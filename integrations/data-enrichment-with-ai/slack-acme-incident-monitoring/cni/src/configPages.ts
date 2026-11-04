import {
  configPage,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "undefined",
    elements: {
      slackConnection: connectionConfigVar({
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
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            clientSecret: {
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
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
                "chat:write chat:write.public chat:write.customize channels:read groups:read im:read mpim:read users:read users:read.email channels:history im:history",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            signingSecret: {
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            tokenUrl: {
              value: "https://slack.com/api/oauth.v2.access",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
          },
        },
      }),
      "OpenAI Connection": connectionConfigVar({
        stableKey: "openAiConnection",
        dataType: "connection",
        connection: {
          component: "openai",
          key: "openAiApiKey",
          values: {
            apiKey: {
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
            organization: {
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
          },
        },
      }),
    },
  }),
  "Alert Channel": configPage({
    tagline: "",
    elements: {
      "Alert Channel": dataSourceConfigVar({
        stableKey: "alertChannel",
        dataType: "picklist",
        dataSource: {
          component: "slack",
          key: "selectChannels",
          values: {
            connection: {
              configVar: "slackConnection",
            },
            includeImChannels: {
              value: false,
            },
            includeMultiPartyImchannels: {
              value: false,
            },
            includePrivateChannels: {
              value: false,
            },
            includePublicChannels: {
              value: true,
            },
            showIdInDropdown: {
              value: false,
            },
          },
        },
      }),
    },
  }),
};
