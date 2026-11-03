import {
  configPage,
  customerActivatedConnection,
} from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "Configure your Salesforce connection",
    elements: {
      "Salesforce Connection": customerActivatedConnection({
        stableKey: "salesforce-cac",
      }),
    },
  }),
};
