import { dataSource, Element, input, util } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput, teamId, workspaceId } from "../inputs";
import { cleanString, fetchMoreData } from "../util";
import { DataSource } from "../types/Project";

const selectProject = dataSource({
  display: {
    label: "Select Projects",
    description: "Select a project from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
    workspace: { ...workspaceId, required: false, clean: cleanString },
    team: { ...teamId, required: false, clean: cleanString },
  },
  perform: async (context, { connection, team, workspace }) => {
    const client = await createAsanaClient(connection);
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
      }
    );

    const result = data.map<Element>(({ gid, name }) => ({
      label: name,
      key: gid,
    }));
    return { result };
  },
  dataSourceType: "picklist",
});

export default {
  selectProject,
};
