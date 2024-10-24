import { action } from "@prismatic-io/spectral";
import { connectionInput } from "../inputs";
import { googleStorageClient } from "../client";
import {
  handleErrors,
  inputs as httpClientInputs,
  sendRawRequest,
} from "@prismatic-io/spectral/dist/clients/http";

const rawRequest = action({
  display: {
    label: "Raw Request",
    description: "Send raw HTTP request to Google Cloud Storage",
  },
  inputs: {
    connection: connectionInput,
    ...httpClientInputs,
    url: {
      ...httpClientInputs.url,
      comments:
        "Input the path only (/storage/v1/b/[BUCKET_NAME]/o/[OBJECT_NAME]), The base URL is already included (https://storage.googleapis.com).",
      example: "/storage/v1/b/[BUCKET_NAME]/o/[OBJECT_NAME]",
    },
  },
  perform: async (context, { connection, ...httpClientInputs }) => {
    const accessToken = await googleStorageClient(
      connection
    ).authClient.getAccessToken();

    const { data } = await sendRawRequest(
      "https://storage.googleapis.com",
      httpClientInputs,
      { Authorization: `Bearer ${accessToken}` }
    );

    return { data };
  },
});

export default rawRequest;
