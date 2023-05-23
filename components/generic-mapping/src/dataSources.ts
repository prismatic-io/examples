import { dataSource, input, JSONForm, util } from "@prismatic-io/spectral";
import forms from "./forms";
import { createClient } from "./client";

const sourceConnection = input({
  label: "Source Connection",
  type: "connection",
  required: false,
});

const selectedObjects = input({
  label: "Selected Object",
  type: "objectSelection",
  required: true,
  clean: (value) => util.types.toObjectSelection(value),
});

export const fieldMappingSourceNoInput = dataSource({
  display: {
    label: "Third-Party Field Mapping - No Input",
    description: "",
  },
  perform: async (context, { selectedObjects, connection }) => {
    const client = createClient(connection);
    const mappingObject = selectedObjects[0];
    if (!mappingObject.fields) {
      throw new Error("No fields provided in mapping object");
    }
    const sourceFields = await client.getSourceFields();
    const selectedObjectFields = mappingObject.fields.map((field) => ({
      const: field.key,
      title: field.label ? field.label : field.key,
    }));

    const schema = forms.fieldMapping.getMappingSchema(
      sourceFields,
      selectedObjectFields
    );
    const uiSchema = forms.fieldMapping.getUISchema();
    return {
      result: {
        schema,
        uiSchema,
        data: {},
      },
    };
  },
  inputs: {
    connection: input({
      label: "Connection",
      required: true,
      type: "connection",
    }),
    selectedObjects,
  },
  dataSourceType: "jsonForm",
});
export const fieldMappingSource = dataSource({
  display: {
    label: "Third-Party Field Mapping",
    description: "",
  },
  perform: async (context, { selectedObjects, ...params }) => {
    const mappingObject = selectedObjects[0];
    if (!mappingObject.fields) {
      throw new Error("No fields provided in mapping object");
    }

    const selectedObjectFields = mappingObject.fields.map((field) => ({
      const: field.key,
      title: field.label ? field.label : field.key,
    }));
    const sourceFields = params.sourceFields.map(({ key, value }) => ({
      const: key,
      title: util.types.toString(value),
    }));

    const schema = forms.fieldMapping.getMappingSchema(
      sourceFields,
      selectedObjectFields
    );
    const uiSchema = forms.fieldMapping.getUISchema();
    return {
      result: {
        schema,
        uiSchema,
        data: {},
      },
    };
  },
  inputs: {
    selectedObjects,
    sourceFields: input({
      label: "Source Fields",
      required: true,
      type: "string",
      collection: "keyvaluelist",
    }),
  },
  dataSourceType: "jsonForm",
});

export default {
  fieldMappingSource,
};
