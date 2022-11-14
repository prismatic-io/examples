import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  teamDescription,
  teamName,
  organizationId,
  connectionInput,
} from "../../inputs";

export const createTeam = action({
  display: {
    label: "Create Team",
    description: "Create a new team",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(`/teams`, {
      data: {
        description: params.teamDescription || undefined,
        name: params.teamName,
        organization: params.organizationId || undefined,
      },
    });
    return { data };
  },
  inputs: {
    teamDescription,
    teamName,
    organizationId,
    asanaConnection: connectionInput,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202466032099844",
        resource_type: "team",
        name: "My New Team",
        permalink_url: "https://app.asana.com/0/1202466032099844",
        organization: {
          gid: "1126509132283071",
          resource_type: "workspace",
          name: "Prismatic",
        },
      },
    },
  },
});
