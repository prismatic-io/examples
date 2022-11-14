import { action, input } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, workspaceId } from "../../inputs";

interface Team {
  gid: string;
  name: string;
  resource_type: string;
}

interface TeamReturn {
  data: {
    data: Team[];
    next_page: {
      offset: string;
      path: string;
      uri: string;
    };
  };
}

export const findTeamByName = action({
  display: {
    label: "Find Team by Name",
    description: "Find a team of a given name within a workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    let offset = undefined;
    let stop = false;
    while (!stop) {
      const response: TeamReturn = await client.get(
        `/workspaces/${params.workspaceId}/teams`,
        {
          params: { offset },
        }
      );
      const filteredData = response.data.data.filter(
        (team) => params.teamName === team.name
      );
      if (filteredData.length > 0) {
        return { data: filteredData[0] };
      }
      offset = response.data.next_page?.offset;
      if (!offset) {
        stop = true;
      }
    }
    throw new Error(`No team named "${params.teamName}" found.`);
  },
  inputs: {
    asanaConnection: connectionInput,
    teamName: input({
      label: "Team Name",
      type: "string",
      required: true,
      comments:
        "Note: if multiple teams share a name, only one team will be returned.",
    }),
    workspaceId,
  },
  examplePayload: {
    data: {
      gid: "1126509132283071",
      name: "Example Team",
      resource_type: "team",
    },
  },
});
