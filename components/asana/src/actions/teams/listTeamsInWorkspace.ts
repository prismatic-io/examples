import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, workspaceId } from "../../inputs";

export const listTeams = action({
  display: {
    label: "List Teams",
    description: "List all teams in the given workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(
      `/workspaces/${params.workspaceId}/teams`
    );
    return { data };
  },
  inputs: { asanaConnection: connectionInput, workspaceId },
  examplePayload: {
    data: {
      data: [
        { gid: "1126509132283073", name: "Founders", resource_type: "team" },
        { gid: "1201132129713512", name: "Design", resource_type: "team" },
        { gid: "1201340876723312", name: "Engineering", resource_type: "team" },
      ],
    },
  },
});
