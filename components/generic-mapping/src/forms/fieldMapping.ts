import { JsonSchema, UISchemaElement } from "@jsonforms/core";

const getMappingSchema = (
  sourceFields: { title: string; const: string }[],
  thirdPartyFields: { title: string; const: string }[]
): JsonSchema => {
  const schema = {
    properties: {
      mappings: {
        type: "array",
        title: "Field Mappings",
        items: {
          type: "object",
          properties: {
            sourceField: {
              type: "string",
              title: "Source Field",
              oneOf: sourceFields,
            },
            destinationField: {
              type: "string",
              title: "Third-Party Field",
              oneOf: thirdPartyFields,
            },
          },
        },
      },
    },
  };

  return schema;
};

const getUISchema = (): UISchemaElement =>
  ({
    type: "Control",
    scope: "#/properties/mappings",
    options: {
      layout: "Accordion",
      detail: {
        elements: [
          {
            type: "HorizontalLayout",
            elements: [
              {
                type: "Control",
                scope: "#/properties/sourceField",
              },
              {
                type: "Control",
                scope: "#/properties/destinationField",
              },
            ],
          },
        ],
      },
    },
  } as UISchemaElement);

export default { getMappingSchema, getUISchema };
