import {
  configPage,
  connectionConfigVar,
  customerActivatedConnection,
  input,
} from "@prismatic-io/spectral";
import { SalesforceSObjectDataSource } from "./dataSources/sobjectList";
import { SalesforceFieldMappingDataSource } from "./dataSources/fieldMapper";
import { SalesforceFieldMappingValidatorDataSource } from "./dataSources/fieldMapperValidator";

export const configPages = {
  Connections: configPage({
    elements: {
      // This assumes you've created a customer-activated connection
      // with the stable key "salesforce-cac". See
      // https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/
      "Salesforce Connection": customerActivatedConnection({
        stableKey: "salesforce-cac",
      }),
      // Acme is a placeholder for an external system you might want to sync data to.
      // If syncing data to your own system, consider org-activated connections
      "Acme Connection": connectionConfigVar({
        stableKey: "acme-connection",
        dataType: "connection",
        inputs: {
          baseUrl: input({
            label: "Acme Base URL",
            type: "string",
            required: true,
            default: "https://postman-echo.com",
          }),
          apiKey: input({ label: "API Key", type: "password", required: true }),
        },
      }),
    },
  }),
  "Salesforce Record Selection": configPage({
    tagline: "Select a record type to sync with Acme.",
    elements: {
      "Salesforce Record Type": SalesforceSObjectDataSource,
    },
  }),
  "Salesforce Field Mapping": configPage({
    tagline: "Map Salesforce fields to Acme fields.",
    elements: {
      _0: "This field mapper will attempt to pre-fill mappings based on similar field names. Please check all mappings for correctness.",
      "Salesforce Field Mapping": SalesforceFieldMappingDataSource,
    },
  }),
  "Review & Activate": configPage({
    tagline:
      "Review your configuration and activate the integration when ready.",
    elements: {
      "Field Mapping Validation": SalesforceFieldMappingValidatorDataSource,
    },
  }),
};
