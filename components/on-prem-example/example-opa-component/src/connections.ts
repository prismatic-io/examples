import { onPremConnection } from "@prismatic-io/spectral";

export const exampleOpaConnection = onPremConnection({
  key: "exampleOpaConnection",
  label: "Example OPA Connection",
  inputs: {
    endpoint: {
      label: "Endpoint",
      comments:
        "The public endpoint of the mock server. When using on-prem, this is the host name of the server.",
      type: "string",
      required: true,
      default: "https://api.example.com",
    },
    apiKey: {
      label: "API Key",
      comments: "The API key for the mock server",
      type: "string",
      required: true,
      example: "abc-123",
    },
    host: {
      label: "Host",
      comments:
        "The host of the on-prem service. This input will be hidden from customers",
      type: "string",
      required: false,
      shown: false,
      onPremControlled: true,
    },
    port: {
      label: "Port",
      comments:
        "The port of the on-prem service. This input will be hidden from customers",
      type: "string",
      required: false,
      shown: false,
      onPremControlled: true,
    },
  },
});

export default [exampleOpaConnection];
