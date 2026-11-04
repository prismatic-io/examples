import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "undefined",
    elements: {
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
            },
            organization: {
              value: "",
              permissionAndVisibilityType: "organization",
            },
          },
        },
      }),
      "Salesforce Connection": connectionConfigVar({
        stableKey: "salesforceConnection",
        dataType: "connection",
        connection: {
          component: "salesforce",
          key: "oauth2",
          values: {
            authorizeUrl: {
              value: "https://login.salesforce.com/services/oauth2/authorize",
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
            revokeUrl: {
              value: "https://login.salesforce.com/services/oauth2/revoke",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            tokenUrl: {
              value: "https://login.salesforce.com/services/oauth2/token",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
          },
        },
      }),
    },
  }),
};
