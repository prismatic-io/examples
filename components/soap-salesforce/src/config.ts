import { input, connection } from "@prismatic-io/spectral";
export const basicAuth = connection({
  key: "basicAuth",
  label: "Basic Authentication",
  comments: "",
  inputs: {
    username: {
      label: "Username",
      placeholder: "Username",
      type: "string",
      required: true,
      comments: "Username",
    },
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      comments: "Password",
    },
  },
});
const connectionInput = input({
  label: "Connection Input",
  type: "connection",
  required: false,
});
const debug = input({
  label: "Debug Request",
  type: "boolean",
  required: false,
  default: "false",
  comments: "Optionally log the last request and response from the SOAP Client",
});
const queryString = input({
  label: "Query String",
  type: "string",
  required: true,
  default: "",
  example: "SELECT * FROM Account",
  comments: "A Salesforce Query",
});
export const inputs = { connectionInput, debug, queryString };
