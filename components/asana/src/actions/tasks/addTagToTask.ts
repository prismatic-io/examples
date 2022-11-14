import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, taskId, tagId } from "../../inputs";

export const addTagToTask = action({
  display: {
    label: "Add Tag To Task",
    description: "Add a tag to an existing task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/tasks/${params.taskId}/addTag`,
      {
        data: {
          tag: params.tagId,
        },
      },
      {
        params: {
          opt_fields:
            "resource_type,gid,created_at,followers,name,color,workspace",
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    taskId,
    tagId,
  },
  examplePayload: { data: { data: {} } },
});
