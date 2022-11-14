import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, statusId } from "../../inputs";

export const getStatusUpdate = action({
  display: {
    label: "Get Status Update",
    description: "Get a status update",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/status_updates/${params.statusId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    statusId,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202466832682204",
        created_at: "2022-06-17T19:14:25.512Z",
        created_by: {
          gid: "1202178852626547",
          name: "Example User",
          resource_type: "user",
        },
        modified_at: "2022-06-17T19:14:26.506Z",
        resource_type: "status_update",
        resource_subtype: "project_status_update",
        status_type: "on_track",
        text: "It'll be completed on time!",
        title: "Example project is going well",
        parent: {
          gid: "1202178854270532",
          name: "Example Project",
          resource_type: "project",
        },
      },
    },
  },
});
