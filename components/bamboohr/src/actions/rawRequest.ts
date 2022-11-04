import { action, util } from "@prismatic-io/spectral";
import {
  inputs as httpClientInputs,
  sendRawRequest,
} from "@prismatic-io/spectral/dist/clients/http";
import { connectionInput } from "../inputs";

const rawRequest = action({
  display: { label: "Raw Request", description: "Send Raw Request" },
  inputs: {
    connection: connectionInput,
    ...httpClientInputs,
  },
  perform: async (context, { connection, ...httpClientInputs }) => {
    const encodedAuth = Buffer.from(`${connection.fields.apiKey}:x`).toString(
      "base64"
    );
    const { data } = await sendRawRequest(
      `https://api.bamboohr.com/api/gateway.php/${util.types.toString(
        connection.fields.companyDomain
      )}/`,
      httpClientInputs,
      {
        Authorization: `Basic ${encodedAuth}`,
      }
    );
    return { data };
  },
});

export default { rawRequest };
