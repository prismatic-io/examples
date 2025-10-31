import { dataSource } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput, teamId, workspaceId } from "../inputs";
import {
  cleanString,
  fetchMoreData,
  mapToLabelKey,
  handleMultipleWorkspacesError,
} from "../util";
import type { DataSource } from "../types/Project";

const selectProject = dataSource({
  display: {
    label: "Select Projects",
    description: "Select a project from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
    workspace: {
      ...workspaceId,
      required: false,
      clean: cleanString,
      dataSource: undefined,
    },
    team: {
      ...teamId,
      required: false,
      clean: cleanString,
      dataSource: undefined,
    },
  },
  perform: async (_context, { connection, team, workspace }) => {
    try {
      const client = await createAsanaClient(connection, false);
      const canPaginate = workspace || team ? true : false;
      const data = await fetchMoreData<DataSource>(
        client,
        "/projects",
        [],
        canPaginate,
        {
          workspace,
          team,
          limit: canPaginate ? 100 : undefined,
        },
      );

      const result = mapToLabelKey(data);
      return { result };
    } catch (err) {
      handleMultipleWorkspacesError(err);
      throw err;
    }
  },
  dataSourceType: "picklist",
});

export default {
  selectProject,
};
