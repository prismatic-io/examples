import { action } from "@prismatic-io/spectral";
import { createOauthClient } from "../../client";
import { connectionInput, debug, trigger_id, view } from "../../inputs";
import { openViewResponse as pushViewResponse } from "../../examplePayloads";
import { debugLogger } from "../../utils";

export const pushView = action({
  display: {
    label: "Push Views",
    description: "Push a view onto the stack of a root view.",
  },
  perform: async (context, { connection, debug, trigger_id, view }) => {
    debugLogger({ debug, connection, trigger_id, view });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.views.push({
      trigger_id,
      view,
    });
    return { data };
  },
  inputs: {
    view,
    trigger_id,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: pushViewResponse as unknown,
  },
});
