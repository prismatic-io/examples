import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import {
  connectionInput,
  sectionId,
  insertAfter,
  insertBefore,
  sectionName,
} from "../../inputs";
import { SECTION_OPT_FIELDS } from "../../util";

export const updateSection = action({
  display: {
    label: "Update Section",
    description: "Update the information and metadata of a project section",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.put(
      `/sections/${params.sectionId}`,
      {
        data: {
          insert_after: params.insertAfter,
          insert_before: params.insertBefore,
          name: params.sectionName,
        },
      },
      { params: { opt_fields: SECTION_OPT_FIELDS } }
    );
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    sectionId,
    sectionName,
    insertAfter,
    insertBefore,
  },
  examplePayload: {
    data: {
      data: {
        gid: "1202178854270533",
        resource_type: "section",
        created_at: "2022-04-25T19:28:56.749Z",
        name: "My New Section Name",
        project: { gid: "1202178854270532", resource_type: "project" },
      },
    },
  },
});
