import { action, input } from "@prismatic-io/spectral";
import { createExampleOpaHttpClient } from "./client";

const exampleAction = action({
  display: {
    label: "Example Action",
    description:
      "This is an example action that fetches data from the mock server",
  },
  inputs: {
    connection: input({
      label: "Connection",
      required: true,
      type: "connection",
    }),
  },
  perform: async (context, params) => {
    const client = createExampleOpaHttpClient(params.connection);
    const result = await client.get("/");
    return { data: result.data };
  },
});

export default { exampleAction };
