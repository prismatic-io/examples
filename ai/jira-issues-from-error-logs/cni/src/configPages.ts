import {
  configPage,
  connectionConfigVar,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";

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
      "Jira Connection": connectionConfigVar({
        stableKey: "jiraConnection",
        dataType: "connection",
        connection: {
          component: "atlassianJira",
          key: "oauth2",
          values: {
            apiSiteOverride: {
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            authorizeUrl: {
              value:
                "https://auth.atlassian.com/authorize?audience=api.atlassian.com&prompt=consent",
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
            scopes: {
              value:
                "write:jira-work manage:jira-project read:me read:account read:jira-work offline_access",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            tokenUrl: {
              value: "https://auth.atlassian.com/oauth/token",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            version: {
              value: "3",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
          },
        },
      }),
    },
  }),
  "Project Settings": configPage({
    tagline: "",
    elements: {
      Project: dataSourceConfigVar({
        stableKey: "project",
        dataType: "picklist",
        dataSource: {
          component: "atlassianJira",
          key: "selectProject",
          values: {
            connection: {
              configVar: "Jira Connection",
            },
          },
        },
      }),
    },
  }),
  "Issue Settings": configPage({
    tagline: "",
    elements: {
      "Issue Type": dataSourceConfigVar({
        stableKey: "issueType",
        dataType: "picklist",
        dataSource: {
          component: "atlassianJira",
          key: "selectIssueType",
          values: {
            connection: {
              configVar: "Jira Connection",
            },
            projectIds: {
              configVar: "Project",
            },
            returnIssueTypeName: {
              value: "false",
            },
          },
        },
      }),
    },
  }),
};
