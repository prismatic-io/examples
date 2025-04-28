import { flow } from "@prismatic-io/spectral";

export const currentConfig = flow({
  name: "Return configuration",
  stableKey: "eea3a38e-3f7b-46c7-8479-c062bb8500f1",
  description: "Return values of config variables",
  onExecution: async (context) => {
    return Promise.resolve({ data: context.configVars });
  },
});

export default [currentConfig];
