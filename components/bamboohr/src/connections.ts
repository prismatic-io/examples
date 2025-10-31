import { connection } from "@prismatic-io/spectral";

export const apiKey = connection({
  key: "apiKey",
  display: {
    label: "API Key",
    description: "Authenticate with BambooHR using an API key",
  },
  comments: "Authenticate with BambooHR using an API key",
  inputs: {
    apiKey: {
      label: "API Key",
      placeholder: "your-api-key",
      type: "password",
      required: true,
      shown: true,
      comments: "Your BambooHR API key. You can generate this in your BambooHR account settings.",
    },
    companyDomain: {
      label: "Company Domain",
      placeholder: "mycompany",
      type: "string",
      required: true,
      shown: true,
      comments:
        "The MYCOMPANY portion of your https://MYCOMPANY.bamboohr.com instance",
    },
  },
});

export default [apiKey];
