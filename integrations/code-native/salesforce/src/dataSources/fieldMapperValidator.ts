import { dataSourceConfigVar } from "@prismatic-io/spectral";
import { ACME_FIELDS } from "./fieldMapper";

export interface FieldMapping {
  salesforce: string;
  acme: string;
}

export const SalesforceFieldMappingValidatorDataSource = dataSourceConfigVar({
  stableKey: "salesforce-field-mapper-validator",
  dataSourceType: "jsonForm",
  perform: async (context) => {
    const fieldMapping = context.configVars[
      "Salesforce Field Mapping"
    ] as FieldMapping[];

    const errors: string[] = [];

    // Check that each Acme field has exactly one mapping
    for (const field of ACME_FIELDS) {
      const mappingsForField = fieldMapping.filter(
        (mapping) => mapping.acme === field.key
      );
      // If no mapping exists for this Acme field, add an error
      if (mappingsForField.length === 0) {
        errors.push(
          `❌ No mapping found for Acme field "${field.name}" (${field.key})`
        );
      }
      // If more than one mapping exists for this Acme field, add an error
      if (mappingsForField.length > 1) {
        errors.push(
          `❌ Multiple mappings found for Acme field "${field.name}" (${field.key})`
        );
      }
    }

    // Check that no Salesforce fields are mapped more than once
    for (const mapping of fieldMapping) {
      const duplicateMappings = fieldMapping.filter(
        (m) => m.salesforce === mapping.salesforce
      );
      // If a mapping appears more than once, add an error
      if (duplicateMappings.length > 1) {
        errors.push(
          `❌ Salesforce field "${mapping.salesforce}" is mapped to multiple Acme fields: ${duplicateMappings
            .map((m) => m.acme)
            .join(", ")}`
        );
      }
    }

    // If any errors were added to the errors array, return a series of labels displaying the errors
    if (errors.length) {
      return Promise.resolve({
        result: {
          schema: {
            type: "object",
            properties: {
              isInvalid: {
                type: "string",
              },
            },
            // Add an invisible, but required, input to prevent the "Finish" button from being clickable
            required: ["isInvalid"],
          },
          uiSchema: {
            type: "VerticalLayout",
            elements: errors.map((error) => ({
              type: "Label",
              text: `Error: ${error}`,
            })),
          },
        },
      });
    } else {
      // If no errors were present, display a single affirmative label and allow a user to continue
      return Promise.resolve({
        result: {
          schema: {
            type: "object",
            properties: {},
          },
          uiSchema: {
            type: "VerticalLayout",
            elements: [{ type: "Label", text: "✅ No errors found" }],
          },
        },
      });
    }
  },
});
