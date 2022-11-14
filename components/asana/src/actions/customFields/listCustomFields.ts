import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, limit, offset, workspaceId } from "../../inputs";

export const listCustomFields = action({
  display: {
    label: "List Custom Fields",
    description: "List all custom fields in a workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(
      `/workspaces/${params.workspaceId}/custom_fields`,
      {
        params: {
          offset: params.offset,
          limit: params.limit,
          opt_fields:
            "precision,enum_options,description,name,resource_subtype,resource_type,gid",
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    workspaceId,
    limit,
    offset,
  },
  examplePayload: {
    data: {
      data: [
        {
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
        {
          gid: "1202476274909067",
          enum_options: [
            {
              gid: "1202476274909068",
              color: "green",
              enabled: true,
              name: "My First Option",
              resource_type: "enum_option",
            },
            {
              gid: "1202476274909069",
              color: "red",
              enabled: true,
              name: "My Second Option",
              resource_type: "enum_option",
            },
            {
              gid: "1202476274909070",
              color: "orange",
              enabled: true,
              name: "My Third Option",
              resource_type: "enum_option",
            },
          ],
          name: "Do you want these things?",
          description: "",
          resource_subtype: "multi_enum",
          resource_type: "custom_field",
        },
        {
          gid: "1202476390317834",
          name: "Milestone",
          description: "",
          resource_subtype: "text",
          resource_type: "custom_field",
        },
        {
          gid: "1202476390885516",
          name: "Percent Complete",
          description: "",
          precision: 0,
          resource_subtype: "number",
          resource_type: "custom_field",
        },
      ],
    },
  },
});
