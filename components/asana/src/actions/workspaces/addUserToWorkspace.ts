import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { workspaceId, userId, connectionInput } from "../../inputs";

export const addUser = action({
  display: {
    label: "Add User To Workspace",
    description: "Add a new user to the given workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(
      `/workspaces/${params.workspaceId}/addUser`,
      {
        data: { user: params.userId },
      }
    );
    return { data };
  },
  inputs: { workspaceId, userId, asanaConnection: connectionInput },
  examplePayload: {
    data: {
      data: {
        gid: "1126508793140155",
        resource_type: "user",
        name: "Example User",
        email: "user@example.com",
        photo: {
          image_21x21:
            "https://s3.amazonaws.com/profile_photos/1126508793140155.1126509132283075.joZwntHYCrotR7QnI82A_21x21.png",
          image_27x27:
            "https://s3.amazonaws.com/profile_photos/1126508793140155.1126509132283075.joZwntHYCrotR7QnI82A_27x27.png",
          image_36x36:
            "https://s3.amazonaws.com/profile_photos/1126508793140155.1126509132283075.joZwntHYCrotR7QnI82A_36x36.png",
          image_60x60:
            "https://s3.amazonaws.com/profile_photos/1126508793140155.1126509132283075.joZwntHYCrotR7QnI82A_60x60.png",
          image_128x128:
            "https://s3.amazonaws.com/profile_photos/1126508793140155.1126509132283075.joZwntHYCrotR7QnI82A_128x128.png",
        },
      },
    },
  },
});
