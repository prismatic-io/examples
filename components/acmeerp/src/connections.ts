import { connection } from "@prismatic-io/spectral";

// Create a connection that contains an API endpoint URL
// and an API key.
export const apiKeyConnection = connection({
  connectionKey: "apiKey",
  label: "Acme Connection",
  comments: "Acme Connection",
  inputs: {
    endpoint: {
      label: "Acme Endpoint URL",
      placeholder: "Acme Endpoint URL",
      type: "string",
      required: true,
      comments: "Acme API Endpoint URL",
      default:
        "https://my-json-server.typicode.com/prismatic-io/placeholder-data",
      example: "https://my-company.api.acme.com/",
    },
    apiKey: {
      label: "Acme API Key",
      placeholder: "Acme API Key",
      type: "password",
      required: true,
      comments: "Generate at https://app.acme.com/settings/api-keys",
    },
  },
});
