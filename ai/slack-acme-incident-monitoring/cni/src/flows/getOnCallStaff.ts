import { flow } from "@prismatic-io/spectral";

export const getOnCallStaff = flow({
  name: "Get On Call Staff",
  stableKey: "get-on-call-staff",
  description: "",
  isSynchronous: true,
  endpointSecurityType: "customer_optional",
  onTrigger: {
    component: "openai",
    key: "toolFlowTrigger",
    values: {},
  },
  schemas: {
    invoke: {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      properties: {},
      title: "GetOnCallStaff",
      type: "object",
    },
  },
  onExecution: async (context, params) => {
    const { configVars } = context;
    const codeBlock = (await context.components.code.runCode({
      code: `/*
  Access config variables by name through the configVars object. e.g.
    const apiEndpoint = \`\${configVars["App Base URL"]}/api\`;

  Access previous steps' results through the stepResults object. Trigger
  and step names are camelCased. If the step "Get Data from API" returned
  {"foo": "bar", "baz": 123}, you could destructure that data with:
    const { foo, baz } = stepResults.getDataFromApi.results;

  You can return string, number or complex object data. e.g.
    return { data: { foo: "Hello", bar: 123.45, baz: true } };
*/

module.exports = async ({ logger, configVars }, stepResults) => {
  return { data: {
    "user": "Jake Hagle",
    "email": "jake.hagle@prismatic.io"
  } };
};
`,
    })) as any;
    const getUserByEmail = await context.components.slack.getUser({
      connection: configVars["slackConnection"],
      email: codeBlock.data.email,
    });
    return { data: getUserByEmail };
  },
});

export default getOnCallStaff;
