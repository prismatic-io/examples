import { gql, type GraphQLClient } from "graphql-request";

interface Instance {
  instance: {
    integration: {
      id: string;
    };
    configVariables: {
      nodes: Array<{
        id: string;
        status: string;
        requiredConfigVariable: {
          key: string;
          connection: {
            component: {
              key: string;
            };
            key: string;
          };
        };
        inputs: {
          nodes: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
  };
}

export const getInstance = async (
  client: GraphQLClient,
  instanceId: string
) => {
  const result = await client.request<Instance>(
    gql`
      query getInstanceById {
        instance(
          id: "SW5zdGFuY2U6ZDlmMzM1MTEtMWEwZi00MzMxLWJjNjgtOTViZjRlNDlhMzVj"
        ) {
          integration {
            id
          }
          configVariables {
            nodes {
              id
              status
              requiredConfigVariable {
                key
                connection {
                  component {
                    key
                  }
                  key
                }
              }
              inputs {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
    `,
    { instanceId }
  );
  return result.instance;
};
