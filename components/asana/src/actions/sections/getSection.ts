import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, sectionId } from "../../inputs";

export const getSection = action({
  display: {
    label: "Get Section",
    description: "Get the information and metadata of a section",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get(`/sections/${params.sectionId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    sectionId,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202178854270533",
        created_at: "2022-04-25T19:28:56.749Z",
        name: "Discussion topics",
        project: {
          gid: "1202178854270532",
          name: "My Example Project",
          resource_type: "project",
        },
        resource_type: "section",
      },
    },
  },
});
