import { action, util } from "@prismatic-io/spectral";
import { connectionInput } from "../inputs";
import { googleStorageClient, getAccessToken } from "../client";
import {
  handleErrors,
  inputs as httpClientInputs,
  sendRawRequest,
} from "@prismatic-io/spectral/dist/clients/http";

const rawRequest = action({
  display: {
    label: "Raw Request",
    description: "Send a raw HTTP request to Google Cloud Storage API",
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
    const accessToken = getAccessToken({ connection });

    if (accessToken) {
      const { data } = await sendRawRequest(
        "https://storage.googleapis.com",
        httpClientInputs,
        { Authorization: `Bearer ${accessToken}` }
      );
      return { data };
    } else {
      try {
        const { data } = await sendRawRequest(
          "https://storage.googleapis.com",
          httpClientInputs
        );
        return { data };
      } catch (error) {
        const handled = handleErrors(error);
        const serialized = JSON.stringify(handled);
        throw new Error(serialized);
      }
    }
  },
});

export default rawRequest;
