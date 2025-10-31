import { dataSource } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput } from "../inputs";
import { fetchMoreData, mapToLabelKey } from "../util";
import type { DataSource } from "../types/Project";

const selectWorkspace = dataSource({
  display: {
    label: "Select Workspace",
    description: "Select a workspace from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
  },
  perform: async (_context, params) => {
    const client = await createAsanaClient(params.connection, false);
    const data = await fetchMoreData<DataSource>(
      client,
      "/workspaces",
      [],
      true,
      {
        limit: 100,
      },
    );

    const result = mapToLabelKey(data);
    return { result };
  },
  dataSourceType: "picklist",
});

export default {
  selectWorkspace,
};
