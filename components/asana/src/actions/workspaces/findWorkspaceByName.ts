import { action, input } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput } from "../../inputs";

interface Workspace {
  gid: string;
  name: string;
  resource_type: string;
}

interface WorkspaceReturn {
  data: {
    data: Workspace[];
    next_page: {
      offset: string;
      path: string;
      uri: string;
    };
  };
}

export const findWorkspaceByName = action({
  display: {
    label: "Find Workspace by Name",
    description: "Find a workspace of a given name",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    let offset = undefined;
    let stop = false;
    while (!stop) {
      const response: WorkspaceReturn = await client.get("/workspaces", {
        params: { offset },
      });
      const filteredData = response.data.data.filter(
        (workspace) => params.workspaceName === workspace.name
      );
      if (filteredData.length === 1) {
        return { data: filteredData[0] };
      }
      offset = response.data.next_page?.offset;
      if (!offset) {
        stop = true;
      }
    }
    throw new Error(`No workspace named "${params.workspaceName}" found.`);
  },
  inputs: {
    asanaConnection: connectionInput,
    workspaceName: input({
      label: "Workspace Name",
      type: "string",
      required: true,
    }),
  },
  examplePayload: {
    data: {
      gid: "1126509132283071",
      name: "Example Workspace",
      resource_type: "workspace",
    },
  },
});
