import { action } from "@prismatic-io/spectral";
import { connectionInput } from "../inputs";
import { createOauthClient } from "../client";

import {
  sendRawRequest,
  inputs as httpClientInputs,
} from "@prismatic-io/spectral/dist/clients/http";

const rawRequest = action({
  display: {
    label: "Raw Request",
    description: "Send raw HTTP request to Slack",
  },
  inputs: {
    connection: connectionInput,
    ...httpClientInputs,
    url: {
      ...httpClientInputs.url,
      comments:
        "Input the path only (/team.info), The base URL is already included (https://slack.com/api). For example, to connect to https://slack.com/api/team.info, only /team.info is entered in this field.",
      example: "/team.info",
    },
  },
  perform: async (context, { connection, ...httpClientInputs }) => {
    const client = await createOauthClient({ slackConnection: connection });
    const token = client.token;
    const { data } = await sendRawRequest(
      "https://slack.com/api",
      httpClientInputs,
      { Authorization: `Bearer ${token}` },
    );
    return { data };
  },
});

export default rawRequest;
