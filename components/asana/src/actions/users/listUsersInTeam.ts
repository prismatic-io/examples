import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  workspaceId,
  offset,
  limit,
  connectionInput,
  teamId,
} from "../../inputs";

export const listUsersInTeam = action({
  display: {
    label: "List Users In Team",
    description: "List all users in the given team",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/teams/${params.teamId}/users`, {
      params: {
        offset: params.offset,
        limit: params.limit,
        workspace: params.workspaceId || undefined,
      },
    });
    return { data };
  },
  inputs: {
    workspaceId: { ...workspaceId, required: false },
    teamId,
    limit,
    offset,
    asanaConnection: connectionInput,
  },
  examplePayload: {
    data: [
      {
        gid: "54630745323",
        name: "Example User",
        resource_type: "user",
      },
      {
        gid: "54630745323",
        name: "Example User",
        resource_type: "user",
      },
      {
        gid: "54630745323",
        name: "Example User",
        resource_type: "user",
      },
    ],
  },
});
