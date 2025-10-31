import { action } from "@prismatic-io/spectral";
import { createOauthClient } from "../../client";
import { connectionInput, userId, view } from "../../inputs";
import { publishViewResponse } from "../../examplePayloads";
import { debugLogger } from "../../utils";

export const publishView = action({
  display: {
    label: "Publish View",
    description: "Publish a static view for a User.",
  },
  perform: async (
    { debug: { enabled: debug } },
    { connection, userId, view },
  ) => {
    debugLogger({ connection, debug, userId, view });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.views.publish({
      user_id: userId,
      view,
    });
    return { data };
  },
  inputs: {
    view,
    userId,
    connection: connectionInput,
  },
  examplePayload: {
    data: publishViewResponse as unknown,
  },
});
