import {
  configPage,
  organizationActivatedConnection,
} from "@prismatic-io/spectral";

export const configPages = {
  Connections: configPage({
    elements: {
      // Your end user will enter connection information on the first page
      "Postgres Connection": organizationActivatedConnection({
        stableKey: "postgresql-connection",
      }),
    },
  }),
};
