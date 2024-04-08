import { action } from "@prismatic-io/spectral";
import { createAuthorizedClient } from "../auth";
import { connectionInput } from "../inputs";
import { handleDropboxError } from "../util";
import { getCurrentAccountPayload } from "../example-payloads";

export const getCurrentAccount = action({
  display: {
    label: "Get Current Account",
    description: "Get information about the currently authenticated user",
  },
  perform: async (context, { dropboxConnection }) => {
    const dbx = createAuthorizedClient(dropboxConnection);
    try {
      const { result } = await dbx.usersGetCurrentAccount();
      return { data: result };
    } catch (err) {
      handleDropboxError(err);
    }
  },
  inputs: { dropboxConnection: connectionInput },
  examplePayload: {
    data: getCurrentAccountPayload,
  },
});
