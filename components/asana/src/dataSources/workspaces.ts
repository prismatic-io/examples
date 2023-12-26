import { dataSource, Element } from "@prismatic-io/spectral";
import { createAsanaClient } from "../client";
import { connectionInput } from "../inputs";

const selectWorkspace = dataSource({
  display: {
    label: "Select Workspace",
    description: "Select a workspace from a dropdown menu",
  },
  inputs: {
    connection: connectionInput,
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.connection);
    const {
      data: { data },
    } = await client.get<{
      data: { gid: string; name: string }[];
    }>("/workspaces");

    const result = data.map<Element>(({ gid, name }) => ({
      label: name,
      key: gid,
    }));
    return { result };
  },
  dataSourceType: "picklist",
});

export default {
  selectWorkspace,
};
