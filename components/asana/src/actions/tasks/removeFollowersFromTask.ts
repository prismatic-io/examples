import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, taskId, followersList } from "../../inputs";

export const removeFollowersFromTask = action({
  display: {
    label: "Remove Followers From Task",
    description: "Remove followers from the given task",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/tasks/${params.taskId}/removeFollowers`,
      {
        data: {
          followers: params.followersList,
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
    followersList,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461530991735",
        resource_type: "task",
        created_at: "2022-06-16T21:33:52.572Z",
        name: "My new task name",
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
        followers: [],
      },
    },
  },
});
