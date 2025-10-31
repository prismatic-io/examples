import { action } from "@prismatic-io/spectral";
import { createOauthClient } from "../../client";
import { connectionInput, trigger_id, view } from "../../inputs";
import { openViewResponse } from "../../examplePayloads";
import { debugLogger } from "../../utils";

export const openView = action({
  display: {
    label: "Open Views",
    description: "Open a view for a user.",
  },
  perform: async (
    { debug: { enabled: debug } },
    { connection, trigger_id, view },
  ) => {
    debugLogger({ debug, connection, trigger_id, view });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.views.open({
      trigger_id,
      view,
    });
    return { data };
  },
  inputs: {
    view,
    trigger_id,
    connection: connectionInput,
  },
  examplePayload: {
    data: openViewResponse as unknown,
  },
});
