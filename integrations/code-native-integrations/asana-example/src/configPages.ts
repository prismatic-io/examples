import { asanaApiKeyConnection } from "../../../../components/asana-helper/src/connections";
import { configPage, connectionConfigVar } from "@prismatic-io/spectral";

export const configPages = {
  Connections: configPage({
    elements: {
      "Asana API Key": connectionConfigVar({
        stableKey: "f0eab60f-545b-4b46-bebf-04d3aca6b63c",
        dataType: "connection",
        inputs: asanaApiKeyConnection.inputs,
      }),
    },
  }),
};
