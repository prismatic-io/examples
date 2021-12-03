import { input } from "@prismatic-io/spectral";

export const connectionInput = input({
  label: "Acme ERP",
  required: true,
  type: "connection",
});

export const itemIdInput = input({
  label: "Item ID",
  required: true,
  type: "string",
});
