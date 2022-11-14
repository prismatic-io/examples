import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { workspaceId, connectionInput } from "../../inputs";

export const getWorkspace = action({
  display: {
    label: "Get Workspace",
    description: "Get the information and metadata of the given Workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/workspaces/${params.workspaceId}`);
    return { data };
  },
  inputs: { workspaceId, asanaConnection: connectionInput },
  examplePayload: {
    data: {
      data: {
        gid: "1126509132283071",
        email_domains: ["example.com"],
        is_organization: true,
        name: "Example Workspace",
        resource_type: "workspace",
      },
    },
  },
});
