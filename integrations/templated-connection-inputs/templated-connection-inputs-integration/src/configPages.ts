import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Connections: configPage({
    elements: {
      // Your end user will enter connection information on the first page
      "Acme Connection": connectionConfigVar({
        stableKey: "4051ad6a-2919-418f-998a-f73d32f42097",
        dataType: "connection",
        connection: {
          component: "templatedConnectionInputsComponent",
          key: "acmeOAuth",
          values: {
            host: {
              value: "",
              permissionAndVisibilityType: "customer",
              visibleToOrgDeployer: true,
            },
            client_number: {
              value: "",
              permissionAndVisibilityType: "customer",
              visibleToOrgDeployer: true,
            },
            consultant_number: {
              value: "",
              permissionAndVisibilityType: "customer",
              visibleToOrgDeployer: true,
            },
          },
        },
      }),
    },
  }),
};
