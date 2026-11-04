import {
  configPage,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "undefined",
    elements: {
      "Dropbox Connection": connectionConfigVar({
        stableKey: "dropboxConnection",
        dataType: "connection",
        connection: {
          component: "dropbox",
          key: "oauth",
          values: {
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
            },
            organization: {
              value: "",
              permissionAndVisibilityType: "organization",
            },
          },
        },
      }),
    },
  }),
  Settings: configPage({
    tagline: "",
    elements: {
      "Import Folder": dataSourceConfigVar({
        stableKey: "importFolder",
        dataType: "picklist",
        dataSource: {
          component: "dropbox",
          key: "listFolders",
          values: {
            connection: {
              configVar: "Dropbox Connection",
            },
            cursor: {
              value: "",
            },
            entryFilter: {
              value: "all",
            },
            limit: {
              value: "",
            },
            path: {
              value: "/",
            },
            recursive: {
              value: false,
            },
            teamMemberId: {
              value: "",
            },
            userType: {
              value: "",
            },
          },
        },
      }),
    },
  }),
};
