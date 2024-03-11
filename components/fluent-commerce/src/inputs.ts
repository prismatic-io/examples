import { input } from "@prismatic-io/spectral";

export const connectionInput = input({
  label: "Connection",
  type: "connection",
  required: true,
  comments: "An OAuth 2.0 password grant type connection",
});
