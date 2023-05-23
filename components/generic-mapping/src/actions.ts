import { action, input, util } from "@prismatic-io/spectral";
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
const mappingConfig = input({
  label: "Mapping Configuration",
  type: "data",
  required: true,
});

export const applyMapping = action({
  display: {
    label: "Apply Mapping",
    description: "Applies the mapping from source to destination",
  },
  perform: async (context, params) => {
    const lookupMappings = (
      params.mappingFields as [
        { sourceField: string; destinationField: string }
      ]
    ).reduce((prev, { sourceField, destinationField }) => {
      return { ...prev, [sourceField]: destinationField };
    }, {} as any);

    const fields = Object.entries(params.objectToMap as any);

    const remappedFields = fields.reduce((prev, [key, value]) => {
      if (lookupMappings[key]) {
        return {
          ...prev,
          [lookupMappings[key]]: util.types.toString(value),
        };
      }
      return prev;
    }, {});

    return {
      data: { remappedFields },
    };
  },
  inputs: {
    objectToMap: input({
      label: "Object to Map",
      required: true,
      type: "data",
    }),
    mappingFields: input({
      label: "Mapping Fields",
      type: "data",
      required: true,
    }),
  },
});
export const getMapping = action({
  display: {
    label: "Get Mapping",
    description: "Return the fully mapped object and fields from the JSON Form",
  },
  perform: async ({ logger }, params) => {
    const mappingConfig = params.mappingConfig as any;
    const mappingObject = params.mappingObject[0];
    return {
      data: { mappingObject, mappingConfig },
    };
  },
  inputs: {
    mappingConfig,
    mappingObject: input({
      label: "Mapping Object",
      type: "objectSelection",
      required: true,
      clean: util.types.toObjectSelection,
    }),
  },
});

export default { getMapping, applyMapping };
