import { action } from "@prismatic-io/spectral";
import { createOauthClient } from "../../client";
import {
  connectionInput,
  debug,
  view_id,
  view,
  external_id,
} from "../../inputs";
import { openViewResponse as updateViewResponse } from "../../examplePayloads";
import { debugLogger } from "../../utils";

export const updateView = action({
  display: {
    label: "Update Views",
    description: "Update an existing view.",
  },
  perform: async (
    context,
    { connection, debug, view_id, external_id, view }
  ) => {
    debugLogger({ debug, connection, view_id, external_id, view });
    const client = await createOauthClient({
      slackConnection: connection,
    });
    const data = await client.views.update({
      view_id: view_id || undefined,
      external_id: external_id || undefined,
      view,
    });
    return { data };
  },
  inputs: {
    view,
    view_id,
    external_id,
    connection: connectionInput,
    debug,
  },
  examplePayload: {
    data: updateViewResponse as any,
  },
});
