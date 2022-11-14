import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { limit, offset, connectionInput, tagId } from "../../inputs";

export const deleteTag = action({
  display: {
    label: "Delete Tag",
    description: "Delete the information and metadata of the given tag",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.delete(`/tags/${params.tagId}`);
    return { data };
  },
  inputs: { asanaConnection: connectionInput, limit, offset, tagId },
  examplePayload: { data: { data: {} } },
});
