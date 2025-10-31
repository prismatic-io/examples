import { dataSource } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput, workspaceId } from "../inputs";
import type { DataSource } from "../types/Project";
import { mapToLabelKey } from "../util";

const selectTeam = dataSource({
  display: {
    label: "Select Team",
    description: "Select a team from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
    workspaceId: { ...workspaceId, dataSource: undefined },
  },
  perform: async (_context, { connection, workspaceId }) => {
    const client = await createAsanaClient(connection, false);
    const { data } = await client.get<{ data: DataSource[] }>(
      `/workspaces/${workspaceId}/teams`,
    );

    const result = mapToLabelKey(data.data);

    return { result };
  },
  dataSourceType: "picklist",
});

export default {
  selectTeam,
};
