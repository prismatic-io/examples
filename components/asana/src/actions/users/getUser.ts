import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { userId, connectionInput } from "../../inputs";

const examplePayload = {
  data: {
    data: {
      gid: "1126508793140155",
      email: "user@example.com",
      name: "Example User",
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
      resource_type: "user",
      workspaces: [
        {
          gid: "1126509132283071",
          name: "Example Workspace",
          resource_type: "workspace",
        },
      ],
    },
  },
};

export const getUsers = action({
  display: {
    label: "Get User",
    description: "Get the information and metadata of a user",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/users/${params.userId}`);
    return { data };
  },
  inputs: { userId, asanaConnection: connectionInput },
  examplePayload,
});

export const getCurrentUser = action({
  display: {
    label: "Get Current User",
    description: "Get information about the currently authenticated user",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get("/users/me");
    return { data };
  },
  inputs: { asanaConnection: connectionInput },
  examplePayload,
});
