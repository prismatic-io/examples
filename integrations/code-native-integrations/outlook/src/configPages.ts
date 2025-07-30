import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "undefined",
    elements: {
      "Microsoft Outlook Connection": connectionConfigVar({
        stableKey: "microsoftOutlookConnection",
        dataType: "connection",
        connection: {
          component: "msOutlook",
          key: "oauth",
          values: {
            baseUrl: {
              value: "https://graph.microsoft.com",
            },
            authorizeUrl: {
              value:
                "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            },
            tokenUrl: {
              value:
                "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            },

            clientId: {
              value: process.env.MICROSOFT_CLIENT_ID || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            clientSecret: {
              value: process.env.MICROSOFT_CLIENT_SECRET || "",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
            scopes: {
              value:
                "https://graph.microsoft.com/User.Read https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send offline_access",
              permissionAndVisibilityType: "organization",
              visibleToOrgDeployer: false,
            },
          },
        },
      }),
    },
  }),
};
