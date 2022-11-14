import { action, input } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, workspaceId } from "../../inputs";

interface Workspace {
  gid: string;
  name: string;
  resource_type: string;
}

interface User {
  gid: string;
  name: string;
  email: string;
  resource_type: string;
  workspaces: Workspace[];
}

interface UserReturn {
  data: {
    data: User[];
    next_page: {
      offset: string;
      path: string;
      uri: string;
    };
  };
}

export const findUserByNameOrEmail = action({
  display: {
    label: "Find User by Name or Email",
    description:
      "Find a user with the given name or email address in your workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    let offset = undefined;
    let stop = false;
    while (!stop) {
      const response: UserReturn = await client.get(`/users`, {
        params: {
          offset,
          workspace: params.workspaceId || undefined,
          opt_fields: "gid,name,resource_type,email,workspaces",
        },
      });
      const filteredData = response.data.data.filter(
        (user) =>
          params.userName === user.name || params.userEmail === user.email
      );
      if (filteredData.length > 0) {
        return { data: filteredData[0] };
      }
      offset = response.data.next_page?.offset;
      if (!offset) {
        stop = true;
      }
    }
    throw new Error(
      `No user could be found with name "${params.userName}" or email "${params.userEmail}".`
    );
  },
  inputs: {
    asanaConnection: connectionInput,
    userName: input({
      label: "User's Full Name",
      type: "string",
      example: "John Doe",
      required: false,
      comments:
        "Note: if multiple users share a name, only one user will be returned.",
    }),
    userEmail: input({
      label: "User's Email",
      type: "string",
      example: "john.doe@example.com",
      required: false,
      comments:
        "Note: if multiple users share an email address, only one user will be returned.",
    }),
    workspaceId,
  },
  examplePayload: {
    data: {
      gid: "1126508793140155",
      email: "user@example.com",
      name: "Example User",
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
});
