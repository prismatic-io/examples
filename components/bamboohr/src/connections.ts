import { connection } from "@prismatic-io/spectral";

export const apiKey = connection({
  key: "apiKey",
  display: {
    label: "Bamboo API Key",
    description: "Bamboo API Key",
  },
  comments: "Bamboo API Key",
  inputs: {
    apiKey: {
      label: "API Key",
      placeholder: "API Key",
      type: "password",
      required: true,
      shown: true,
      comments: "Bamboo API Key",
    },
    companyDomain: {
      label: "Company Domain",
      type: "string",
      required: true,
      shown: true,
      comments:
        "The MYCOMPANY portion of your https://MYCOMPANY.bamboohr.com instance",
    },
  },
});

export default [apiKey];
