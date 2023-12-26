import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  followersList,
  color,
  name,
  notes,
  tagId,
} from "../../inputs";
import { TAG_OPT_FIELDS } from "../../util";

export const updateTag = action({
  display: {
    label: "Update Tag",
    description: "Update the information and metadata of the given tag",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.put(
      `/tags/${params.tagId}`,
      {
        data: {
          color: params.color,
          name: params.name,
          notes: params.notes,
        },
      },
      {
        params: {
          opt_fields: TAG_OPT_FIELDS,
        },
      }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    tagId,
    color,
    name,
    notes,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202461644189657",
        resource_type: "tag",
        created_at: "2022-06-16T22:04:33.095Z",
        name: "My Updated Tag Name",
        notes: "My Updated Notes",
        workspace: { gid: "1126509132283071", resource_type: "workspace" },
        color: "dark-green",
        followers: [],
      },
    },
  },
});
