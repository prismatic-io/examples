import { gql, type GraphQLClient } from "graphql-request";

interface DisconnecResponse {
  disconnectConnection: {
    instanceConfigVariable: {
      status: string;
    };
    errors: Array<{
      field: string;
      messages: string[];
    }>;
  };
}

export async function disconnectConnection(
  client: GraphQLClient,
  configVarId: string
) {
  const result = await client.request<DisconnecResponse>(
    gql`
      mutation disconnect($configVarId: ID!) {
        disconnectConnection(input: { id: $configVarId }) {
          instanceConfigVariable {
            status
          }
          errors {
            field
            messages
          }
        }
      }
    `,
    { configVarId }
  );
  if (result.disconnectConnection.instanceConfigVariable.status !== "PENDING") {
    throw new Error(
      "Something went wrong. This connection should have gone to 'PENDING' status."
    );
  }
}
