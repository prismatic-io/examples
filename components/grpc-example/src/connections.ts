import { connection } from "@prismatic-io/spectral";

export const myConnection = connection({
  key: "myConnection",
  display: {
    label: "My Connection",
    description: "This is my connection",
  },
  inputs: {
    username: {
      label: "Username",
      placeholder: "Username",
      type: "string",
      required: true,
      comments: "Username for my Connection",
    },
    password: {
      label: "Password",
      placeholder: "Password",
      type: "password",
      required: true,
      comments: "Password for my Connection",
    },
  },
});

export default [myConnection];
