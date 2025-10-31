import { dataSource } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput, projectId } from "../inputs";
import { fetchMoreData, mapToLabelKey } from "../util";
import type { DataSource } from "../types/Project";

const selectSection = dataSource({
  display: {
    label: "Select Section",
    description: "Select a section from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
    projectId: { ...projectId, dataSource: undefined },
  },
  perform: async (_context, { connection, projectId }) => {
    const client = await createAsanaClient(connection, false);
    const data = await fetchMoreData<DataSource>(
      client,
      `/projects/${projectId}/sections`,
      [],
      true,
    );

    const result = mapToLabelKey(data);
    return { result };
  },
  dataSourceType: "picklist",
});

export default {
  selectSection,
};
