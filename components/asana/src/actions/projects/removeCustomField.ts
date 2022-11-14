import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, projectId, fieldId } from "../../inputs";

export const removeCustomFieldFromProject = action({
  display: {
    label: "Remove Custom Field From Project",
    description: "Remove an existing Custom Field from an existing Project",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/projects/${params.projectId}/removeCustomFieldSetting`,
      {
        data: {
          custom_field: params.fieldId,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    fieldId,
  },
  examplePayload: { data: { data: {} } },
});
