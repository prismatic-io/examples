import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, workspaceId, fieldId } from "../../inputs";
import { CUSTOM_FIELD_OPT_FIELDS } from "../../util";

export const getCustomField = action({
  display: {
    label: "Get Custom Field",
    description: "Get the information and metadata of a custom field",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/custom_fields/${params.fieldId}`, {
      params: {
        opt_fields: CUSTOM_FIELD_OPT_FIELDS,
        opt_pretty: true,
      },
    });
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    fieldId,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202467472002610",
        enum_options: [
          {
            gid: "1202467472002611",
            color: "red",
            enabled: true,
            name: "High",
            resource_type: "enum_option",
          },
          {
            gid: "1202467472002612",
            color: "orange",
            enabled: true,
            name: "Medium",
            resource_type: "enum_option",
          },
          {
            gid: "1202467472002613",
            color: "yellow-orange",
            enabled: true,
            name: "Low",
            resource_type: "enum_option",
          },
        ],
        name: "Priority",
        description: "Asana-created. Track the priority of each task.",
        resource_subtype: "enum",
        resource_type: "custom_field",
      },
    },
  },
});
