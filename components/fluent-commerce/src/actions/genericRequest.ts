import merge from "lodash.merge";
import { action, input, util } from "@prismatic-io/spectral";
import { createFluentClient } from "../client";
import { connectionInput } from "../inputs";

const genericRequest = action({
  display: {
    label: "Generic GraphQL Request",
    description: "Issue any GraphQL query or mutation with variables",
  },
  inputs: {
    connection: connectionInput,
    query: input({
      label: "Query or Mutation",
      type: "code",
      required: true,
      language: "graphql",
      default: `{
  me {
    id
    username
    primaryEmail
  }
}`,
      clean: util.types.toString,
    }),
    variables: input({
      label: "Variables",
      type: "string",
      required: false,
      collection: "keyvaluelist",
      clean: (val: any) => util.types.keyValPairListToObject(val),
    }),
    variablesObject: input({
      label: "Variables Object",
      type: "code",
      language: "json",
      required: false,
      clean: (value) => (value ? util.types.toObject(value) : {}),
    }),
  },
  perform: async (context, params) => {
    const client = await createFluentClient(params.connection);
    const data = await client.request(
      params.query,
      merge(params.variables, params.variablesObject)
    );
    return { data };
  },
});

export default { genericRequest };
