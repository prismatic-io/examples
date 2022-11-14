import { action, util } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  projectId,
  insertAfter,
  insertBefore,
  fieldId,
  isImportant,
} from "../../inputs";

export const addCustomFieldToProject = action({
  display: {
    label: "Add Custom Field To Project",
    description: "Add a new Custom Field to an existing Project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/projects/${params.projectId}/addCustomFieldSetting`,
      {
        data: {
          custom_field: params.fieldId,
          insert_after: params.insertAfter,
          insert_before: params.insertBefore,
          is_important: params.isImportant,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    fieldId,
    insertAfter,
    insertBefore,
    isImportant,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202476446247138",
        resource_type: "custom_field_setting",
        custom_field: {
          gid: "1202476274909067",
          resource_type: "custom_field",
          created_by: {
            gid: "1202467472237333",
            resource_type: "user",
            name: "Example User",
          },
          resource_subtype: "multi_enum",
          type: "multi_enum",
          name: "Do you want these things?",
          enum_options: [
            {
              gid: "1202476274909068",
              resource_type: "enum_option",
              enabled: true,
              name: "My First Option",
              color: "green",
            },
            {
              gid: "1202476274909069",
              resource_type: "enum_option",
              enabled: true,
              name: "My Second Option",
              color: "red",
            },
            {
              gid: "1202476274909070",
              resource_type: "enum_option",
              enabled: true,
              name: "My Third Option",
              color: "orange",
            },
          ],
        },
        is_important: true,
        parent: {
          gid: "1202467472002605",
          resource_type: "project",
          name: "Brand redesign campaign",
        },
        project: {
          gid: "1202467472002605",
          resource_type: "project",
          name: "Brand redesign campaign",
        },
      },
    },
  },
});
