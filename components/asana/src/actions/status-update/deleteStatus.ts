import { action } from "@prismatic-io/spectral";
import { createAsanaClient } from "../../client";
import { connectionInput, statusId } from "../../inputs";

export const deleteStatus = action({
  display: {
    label: "Delete Status",
    description: "Delete a status update",
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.delete(`/status_updates/${params.statusId}`);
    return { data };
  },
  inputs: {
    asanaConnection: connectionInput,
    statusId,
  },
  examplePayload: { data: { data: {} } },
});
