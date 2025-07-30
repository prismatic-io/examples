import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Configuration: configPage({
    tagline: "Configure Gong API credentials",
    elements: {
      "Gong API Credentials": connectionConfigVar({
        stableKey: "gongApiCredentials",
        dataType: "connection",
        inputs: {
          accessKey: {
            type: "password",
            label: "Access Key",
            comments: "Your Gong API Access Key",
            required: true,
          },
          secretKey: {
            type: "password",
            label: "Secret Key",
            comments: "Your Gong API Secret Key",
            required: true,
          }
        },
      }),
    },
  }),
};
