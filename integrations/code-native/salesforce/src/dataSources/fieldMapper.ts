import { Connection, dataSourceConfigVar } from "@prismatic-io/spectral";
import { createSalesforceClient } from "../salesforceClient";
import { search as fuzzySearch } from "fast-fuzzy";

// Hardcoded Acme fields for mapping
export const ACME_FIELDS = [
  { name: "External ID", key: "external_id" },
  { name: "First Name", key: "first_name" },
  { name: "Last Name", key: "last_name" },
  { name: "Email", key: "email" },
  { name: "Phone", key: "phone" },
  { name: "Job Title", key: "job_title" },
  { name: "Company Name", key: "company_name" },
];

export const SalesforceFieldMappingDataSource = dataSourceConfigVar({
  stableKey: "salesforce-field-mapping",
  dataSourceType: "jsonForm",
  description:
    "Map Salesforce fields to Acme fields. Select the Salesforce fields you want to sync to Acme.",
  perform: async (context) => {
    const client = createSalesforceClient(
      context.configVars["Salesforce Connection"] as Connection
    );

    const fields = await client
      .sobject(context.configVars["Salesforce Record Type"] as string)
      .describe();

    return {
      result: {
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              salesforce: {
                type: "string",
                oneOf: fields.fields
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((field) => ({
                    title: field.label,
                    const: field.name,
                  })),
              },
              acme: {
                type: "string",
                oneOf: ACME_FIELDS.map((field) => ({
                  title: field.name,
                  const: field.key,
                })),
              },
            },
            required: ["salesforce", "acme"],
          },
        },
        uiSchema: {
          type: "VerticalLayout",
          elements: [
            {
              type: "Control",
              scope: "#",
              label: "Salesforce / Acme Field Mapper",
            },
          ],
        },
        data: ACME_FIELDS.map((acmeField) => ({
          acme: acmeField.key,
          salesforce: fuzzySearch(
            acmeField.key === "external_id" ? "Id" : acmeField.name,
            fields.fields.map((sfdcField) => sfdcField.name),
            { threshold: 0.8, ignoreCase: true }
          )[0],
        })),
      },
    };
  },
});
