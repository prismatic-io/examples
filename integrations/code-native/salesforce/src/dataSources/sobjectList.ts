import { Connection, dataSourceConfigVar } from "@prismatic-io/spectral";
import { createSalesforceClient } from "../salesforceClient";

export const SalesforceSObjectDataSource = dataSourceConfigVar({
  stableKey: "salesforce-record-type",
  dataSourceType: "jsonForm",
  description:
    "Most customers store lead data in the 'Lead' object, but you can select a custom record type if you store leads elsewhere.",
  perform: async (context) => {
    const client = createSalesforceClient(
      context.configVars["Salesforce Connection"] as Connection
    );

    // Get a list of all object types available
    const response = await client.describeGlobal();

    return {
      result: {
        schema: {
          type: "string",
          oneOf: response.sobjects
            .filter(
              (sObject) =>
                sObject.triggerable &&
                sObject.retrieveable &&
                sObject.createable
            )
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((sObject) => ({
              title: sObject.label,
              const: sObject.name,
            })),
        },
        uiSchema: {
          type: "VerticalLayout",
          elements: [
            {
              type: "Control",
              scope: "#",
              options: {
                autocomplete: true,
              },
            },
          ],
        },
      },
    };
  },
});
