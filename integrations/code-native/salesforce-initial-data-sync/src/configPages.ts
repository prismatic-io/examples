import {
  configPage,
  Connection,
  connectionConfigVar,
  customerActivatedConnection,
  dataSourceConfigVar,
} from "@prismatic-io/spectral";
import { createSfdcClient } from "./sfdcClient";
import { LeadRecordTypeResult } from "./util/types";

export const configPages = {
  Connections: configPage({
    elements: {
      "Salesforce Connection": customerActivatedConnection({
        stableKey: "salesforce-cac",
      }),
      "PostgreSQL Connection": connectionConfigVar({
        stableKey: "postgres-connection",
        dataType: "connection",
        onPremConnectionConfig: "allowed",
        inputs: {
          host: {
            label: "Host",
            type: "string",
            required: true,
            onPremControlled: true,
          },
          port: {
            label: "Port",
            type: "string",
            required: true,
            onPremControlled: true,
          },
          username: { label: "Username", type: "string", required: true },
          password: { label: "Password", type: "string", required: true },
          database: { label: "Database Name", type: "string", required: true },
        },
      }),
    },
  }),
  "Record Type": configPage({
    tagline: "Select the Salesforce record type to sync",
    elements: {
      "Lead Record Type": dataSourceConfigVar({
        stableKey: "salesforce-record-type",
        dataSourceType: "jsonForm",
        description:
          "Most customers store lead data in the 'Lead' object, but you can select a custom record type if you store leads elsewhere.",
        perform: async (context) => {
          const client = createSfdcClient(
            context.configVars["Salesforce Connection"] as Connection,
          );

          // Get a list of all object types available
          const response = await client.describeGlobal();

          return {
            result: {
              schema: {
                type: "object",
                properties: {
                  recordType: {
                    type: "string",
                    oneOf: response.sobjects
                      .filter(
                        (sObject) =>
                          sObject.triggerable &&
                          sObject.retrieveable &&
                          sObject.createable,
                      )
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((sObject) => ({
                        title: sObject.label,
                        const: sObject.name,
                      })),
                  },
                },
              },
              uiSchema: {
                type: "VerticalLayout",
                elements: [
                  {
                    type: "Control",
                    scope: "#/properties/recordType",
                    options: {
                      autocomplete: true,
                    },
                  },
                ],
              },
              data: { recordType: "Lead" },
            },
          };
        },
      }),
    },
  }),
  "Field Mapping": configPage({
    tagline: "Map Salesforce fields",
    elements: {
      _0: "Map the Salesforce fields to the corresponding fields in the Acme database.",
      "Field Mapping": dataSourceConfigVar({
        stableKey: "field-mapping",
        dataSourceType: "jsonForm",
        perform: async (context) => {
          const client = createSfdcClient(
            context.configVars["Salesforce Connection"] as Connection,
          );

          const leadRecordType = (
            context.configVars["Lead Record Type"] as LeadRecordTypeResult
          ).recordType;

          const sfdcFields = await client.sobject(leadRecordType).describe();

          const sfdcFieldOptions = sfdcFields.fields
            .map((field) => ({
              title: field.label,
              const: field.name,
            }))
            .sort((a, b) => a.title.localeCompare(b.title));

          return {
            result: {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    oneOf: sfdcFieldOptions,
                  },
                  email: {
                    type: "string",
                    oneOf: sfdcFieldOptions,
                  },
                  phone: {
                    type: "string",
                    oneOf: sfdcFieldOptions,
                  },
                },
              },
              uiSchema: {
                type: "VerticalLayout",
                elements: [
                  {
                    type: "Control",
                    scope: "#/properties/name",
                    options: { autocomplete: true },
                  },
                  {
                    type: "Control",
                    scope: "#/properties/email",
                    options: { autocomplete: true },
                  },
                  {
                    type: "Control",
                    scope: "#/properties/phone",
                    options: { autocomplete: true },
                  },
                ],
              },
              data: {
                name: "Name",
                email: "Email",
                phone: "Phone",
              },
            },
          };
        },
      }),
    },
  }),
};
