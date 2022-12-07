import { dataSource, Element, input, util } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput } from "../inputs";

const selectProject = dataSource({
  display: {
    label: "Select Projects",
    description: "Select one or more Projects",
  },
  inputs: {
    connection: connectionInput,
    workspace: input({ label: "Workspace", required: false, type: "string" }),
    team: input({ label: "Team", required: false, type: "string" }),
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.connection);
    const {
      data: { data },
    } = await client.get<{
      data: { gid: string; name: string }[];
    }>("/projects", {
      params: {
        ...(params.workspace
          ? { workspace: util.types.toString(params.workspace) }
          : {}),
        ...(params.team ? { team: util.types.toString(params.team) } : {}),
      },
    });

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
