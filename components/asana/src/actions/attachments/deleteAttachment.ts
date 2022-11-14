import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, attachmentId } from "../../inputs";

export const deleteAttachment = action({
  display: {
    label: "Delete Attachment",
    description: "Delete an existing attachment",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.delete(`/attachments/${params.attachmentId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    attachmentId,
  },
  examplePayload: { data: { data: {} } },
});
