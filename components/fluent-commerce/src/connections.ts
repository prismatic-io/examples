import { connection } from "@prismatic-io/spectral";

export const fluentCommerceOAuthPassword = connection({
  key: "fluent-password-grant",
  label: "Fluent Commerce OAuth 2.0 Password Grant",
  comments:
    "Authenticate requests to Fluent Commerce using a username and password",
  inputs: {
    host: {
      label: "Fluent Host",
      type: "string",
      required: true,
      placeholder: "https://REPLACE-ME.api.fluentretail.com",
      example: "https://REPLACE-ME.api.fluentretail.com",
      comments: "The retailer's Fluent API endpoint",
    },
    username: {
      label: "Retailer Username",
      type: "string",
      required: true,
      comments: "The retailer's username",
      example: "john_doe",
    },
    password: {
      label: "Retailer Password",
      type: "password",
      required: true,
      comments: "The retailer's password",
    },
    clientId: {
      label: "OAuth 2.0 Client ID",
      type: "string",
      required: true,
      comments: "A client ID obtained from Fluent support",
    },
    clientSecret: {
      label: "OAuth 2.0 Client Secret",
      type: "password",
      required: true,
      comments: "A client secret obtained from Fluent support",
    },
  },
});

export default [fluentCommerceOAuthPassword];
