import { action } from "@prismatic-io/spectral";
import {
  inputs as httpClientInputs,
  sendRawRequest,
} from "@prismatic-io/spectral/dist/clients/http";
import { connectionInput } from "../inputs";

const rawRequest = action({
  display: {
    label: "Raw Request",
    description: "Send raw HTTP request to Asana",
  },
  inputs: {
    connection: connectionInput,
    ...httpClientInputs,
    url: {
      ...httpClientInputs.url,
      comments:
        "Input the path only (/goals), The base URL is already included (https://app.asana.com/api/1.0). For example, to connect to https://app.asana.com/api/1.0/goals, only /goals is entered in this field.",
      example: "/goals",
    },
  },
  perform: async (context, { connection, ...httpClientInputs }) => {
    const asanaToken =
      connection?.token?.access_token || connection?.fields?.apiKey;
    const { data } = await sendRawRequest(
      "https://app.asana.com/api/1.0",
      httpClientInputs,
      { Authorization: `Bearer ${asanaToken}` }
    );
    return { data };
  },
});

export default rawRequest;
