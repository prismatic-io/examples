import { action, util } from "@prismatic-io/spectral";
import {
  inputs as httpClientInputs,
  sendRawRequest,
} from "@prismatic-io/spectral/dist/clients/http";
import { connectionInput } from "../inputs";

const rawRequest = action({
  display: {
    label: "Raw Request",
    description: "Send raw HTTP request to BambooHR",
  },
  inputs: {
    connection: connectionInput,
    ...httpClientInputs,
    url: {
      ...httpClientInputs.url,
      comments:
        "Input the path only (/v1/employees/directory), The base URL is already included (https://api.bamboohr.com/api/gateway.php/COMPANY_DOMAIN). For example, to connect to https://api.bamboohr.com/api/gateway.php/COMPANY_DOMAIN/v1/employees/directory, only /v1/employees/directory is entered in this field.",
      example: "/v1/employees/directory",
    },
  },
  perform: async (context, { connection, ...httpClientInputs }) => {
    const encodedAuth = Buffer.from(`${connection.fields.apiKey}:x`).toString(
      "base64",
    );
    const { data } = await sendRawRequest(
      `https://api.bamboohr.com/api/gateway.php/${util.types.toString(
        connection.fields.companyDomain,
      )}/`,
      httpClientInputs,
      {
        Authorization: `Basic ${encodedAuth}`,
      },
    );
    return { data };
  },
});

export default { rawRequest };
