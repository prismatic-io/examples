import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { teamId, connectionInput } from "../../inputs";

export const getTeam = action({
  display: {
    label: "Get Team",
    description: "Get the information and metadata of a team",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/teams/${params.teamId}`);
    return { data };
  },
  inputs: { asanaConnection: connectionInput, teamId },
  examplePayload: {
    data: {
      data: {
        gid: "1126509132283073",
        name: "Example Team",
        organization: {
          gid: "1126509132283071",
          name: "Example Org",
          resource_type: "workspace",
        },
        permalink_url: "https://app.asana.com/0/1126509132283073",
        resource_type: "team",
      },
    },
  },
});
