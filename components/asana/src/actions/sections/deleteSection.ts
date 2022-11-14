import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, sectionId } from "../../inputs";

export const deleteSection = action({
  display: {
    label: "Delete Section",
    description: "Delete the information and metadata of a section",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.delete(`/sections/${params.sectionId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    sectionId,
  },
  examplePayload: { data: { data: {} } },
});
