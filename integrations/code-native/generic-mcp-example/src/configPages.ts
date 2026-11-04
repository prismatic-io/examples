import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Connections: configPage({
    elements: {
      // Your end user will enter connection information on the first page
      "Acme Connection": connectionConfigVar({
        stableKey: "acme-connection",
        dataType: "connection",
        inputs: {
          baseUrl: {
            label: "Acme Base URL",
            type: "string",
            required: true,
            default: "https://jsonplaceholder.typicode.com",
          },
          apiKey: {
            label: "Acme API Key",
            placeholder: "Acme API Key",
            type: "password",
            required: true,
            comments: "You can enter any value here for this mock API.",
          },
        },
      }),
    },
  }),
};
