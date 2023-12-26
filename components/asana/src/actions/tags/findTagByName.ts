import { action, input } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, workspaceId } from "../../inputs";
import { TAG_OPT_FIELDS } from "../../util";

interface Tag {
  gid: string;
  name: string;
  color: string;
  created_at: string;
  resource_type: string;
}

interface TagReturn {
  data: {
    data: Tag[];
    next_page: {
      offset: string;
      path: string;
      uri: string;
    };
  };
}

export const findTagByName = action({
  display: {
    label: "Find Tag by Name",
    description: "Find a tag of a given name within a workspace",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    let offset = undefined;
    let stop = false;
    while (!stop) {
      const response: TagReturn = await client.get(
        `workspaces/${params.workspaceId}/tags`,
        {
          params: {
            offset,
            opt_fields: TAG_OPT_FIELDS,
          },
        }
      );
      const filteredData = response.data.data.filter(
        (tag) => params.tagName === tag.name
      );
      if (filteredData.length > 0) {
        return { data: filteredData[0] };
      }
      offset = response.data.next_page?.offset;
      if (!offset) {
        stop = true;
      }
    }
    throw new Error(`No tag named "${params.tagName}" found.`);
  },
  inputs: {
    asanaConnection: connectionInput,
    tagName: input({
      label: "Tag Name",
      type: "string",
      required: true,
      comments:
        "Note: if multiple tags share a name, only one tag will be returned.",
    }),
    workspaceId,
  },
  examplePayload: {
    data: {
      gid: "1202467057873527",
      color: "dark-green",
      created_at: "2022-06-17T20:28:26.601Z",
      name: "My Example Tag Name",
      resource_type: "tag",
    },
  },
});
