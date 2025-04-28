import { action, input } from "@prismatic-io/spectral";

const printConnection = action({
  display: {
    label: "Print connection info",
    description: "Return the values attached to a connection",
  },
  inputs: {
    connection: input({
      label: "Acme Connection",
      type: "connection",
      required: true,
    }),
  },
  perform: (context, { connection }) => {
    return Promise.resolve({ data: connection });
  },
});

export default { printConnection };
