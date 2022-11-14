import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { teamId, userId, connectionInput } from "../../inputs";

export const addUserToTeam = action({
  display: {
    label: "Add User To Team",
    description: "Add an existing user to the given team",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.post(`/teams/${params.teamId}/addUser`, {
      data: { user: params.userId },
    });
    return { data };
  },
  inputs: { teamId, userId, asanaConnection: connectionInput },
  examplePayload: {
    data: {
      data: {
        gid: "1202178854270530",
        resource_type: "team_membership",
        team: {
          gid: "1202178854270529",
          resource_type: "team",
          name: "Engineering",
        },
        user: {
          gid: "1202178852626547",
          resource_type: "user",
          name: "Example User",
        },
        is_guest: false,
      },
    },
  },
});
