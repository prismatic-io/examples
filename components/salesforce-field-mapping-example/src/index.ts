import jsforce from "jsforce";
import { component, dataSource, input, util } from "@prismatic-io/spectral";

const salesforceFieldMappingExample = dataSource({
  dataSourceType: "jsonForm",
  display: {
    label: "Salesforce field mapping example",
    description: "Map fields from a Salesforce 'Lead' to an acme 'Sale'",
  },
  inputs: {
    sfConnection: input({
      label: "Salesforce Connection",
      type: "connection",
      required: true,
    }),
  },
  perform: async (context, params) => {
    // Reference an existing SFDC OAuth access token
    const salesforceClient = new jsforce.Connection({
      instanceUrl: util.types.toString(params.sfConnection.token?.instance_url),
      version: "51.0",
      accessToken: util.types.toString(params.sfConnection.token?.access_token),
    });

    // Fetch all fields on a Lead using https://jsforce.github.io/document/#describe
    const { fields } = await salesforceClient.sobject("Lead").describe();

    // Filter out non-required fields
    const salesforceRequiredLeadFields = fields.filter(
      ({ nillable }) => !nillable
    );

    // Hard-code Acme fields - these can be fetched from an external source, too
    const acmeSaleFields: { name: string; id: number }[] = [
      { id: 123, name: "First Field" },
      { id: 456, name: "Second Field" },
      { id: 789, name: "Third Field" },
    ];

    // Schema defines the shape of the object to be returned to the integration,
    // along with options for dropdown menus
    const schema = {
      type: "object",
      properties: {
        mymappings: {
          // Arrays allow users to make one or more mappings
          type: "array",
          items: {
            // Each object in the array should contain a salesforceField and an acmeField
            type: "object",
            properties: {
              salesforceLeadField: {
                type: "string",
                // Have users select "one of" a dropdown of items
                oneOf: salesforceRequiredLeadFields.map((field) => ({
                  // Display the pretty "label" like "My First Name" to the user
                  title: field.label,
                  // Feed programmatic "name" like "My_First_Name__c" to the integration
                  const: field.name,
                })),
              },
              acmeSaleField: {
                type: "string",
                oneOf: acmeSaleFields.map((field) => ({
                  title: field.name,
                  const: util.types.toString(field.id), // JSON Forms requires string values
                })),
              },
            },
          },
        },
      },
    };

    // UI Schema defines how the schema should be displayed in the configuration wizard
    const uiSchema = {
      type: "VerticalLayout",
      elements: [
        {
          type: "Control",
          scope: "#/properties/mymappings",
          label: "Salesforce Lead <> Acme Sale Field Mapper",
        },
      ],
    };

    // You can optionally provide default values for mappings. This maps the first
    // SFDC field to the first Acme field, the second to the second, etc.
    const defaultValues = {
      mymappings: [
        {
          salesforceLeadField: util.types.toString(
            salesforceRequiredLeadFields[0].name
          ),
          acmeSaleField: util.types.toString(acmeSaleFields[0].id),
        },
        {
          salesforceLeadField: util.types.toString(
            salesforceRequiredLeadFields[1].name
          ),
          acmeSaleField: util.types.toString(acmeSaleFields[1].id),
        },
        {
          salesforceLeadField: util.types.toString(
            salesforceRequiredLeadFields[2].name
          ),
          acmeSaleField: util.types.toString(acmeSaleFields[2].id),
        },
      ],
    };

    return {
      result: { schema, uiSchema, data: defaultValues },
    };
  },
});

export default component({
  key: "salesforce-acme-field-mapper",
  public: false,
  display: {
    label: "Salesforce Field Mapper Example",
    description: "Map fields from Salesforce to Acme",
    iconPath: "icon.png",
  },
  dataSources: { salesforceFieldMappingExample },
});
