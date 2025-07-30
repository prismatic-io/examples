import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "Configure your Salesforce connection",
    elements: {
      "Salesforce Connection": connectionConfigVar({
        stableKey: "123-123123-r45243345asdf-asdf",
        dataType: "connection",
        connection: {
          component: "salesforce",
          key: "oauth2",
          values: {
            clientId: {
              value: process.env.SALESFORCE_CLIENT_ID || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
            clientSecret: {
              value: process.env.SALESFORCE_CLIENT_SECRET || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
            scopes: {
              value: "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: true,
            },
          },
        },
      }),
    },
  }),
};
