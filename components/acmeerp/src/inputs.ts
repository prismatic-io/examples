import { input } from "@prismatic-io/spectral";

export const endpointUrlInput = input({
  label: "Endpoint URL",
  required: true,
  type: "string",
});

export const itemIdInput = input({
  label: "Item ID",
  required: true,
  type: "string",
});
