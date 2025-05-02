import { gql, type GraphQLClient } from "graphql-request";

interface Instance {
  integration: {
    id: string;
    name: string;
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
            label: string;
          };
          key: string;
          label: string;
        };
      };
    }>;
  };
}

interface InstancesResponse {
  instances: {
    nodes: Instance[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export async function* getErroredTestConnections(client: GraphQLClient) {
  let hasNextPage = true;
  let cursor = "";
  while (hasNextPage) {
    const result = await client.request<InstancesResponse>(
      gql`
        query getErroredTestConnections($cursor: String) {
          instances(
            isSystem: true
            sortBy: { direction: ASC, field: CREATED_AT }
            after: $cursor
          ) {
            nodes {
              integration {
                id
                name
              }
              configVariables(status: "error") {
                nodes {
                  id
                  status
                  requiredConfigVariable {
                    key
                    connection {
                      component {
                        key
                        label
                      }
                      key
                      label
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      { cursor }
    );
    for (const instance of result.instances.nodes) {
      for (const configVar of instance.configVariables.nodes) {
        yield {
          configVarId: configVar.id,
          configVarName: configVar.requiredConfigVariable.key,
          componentName:
            configVar.requiredConfigVariable.connection.component.label,
          connectionName: configVar.requiredConfigVariable.connection.label,
          integrationName: instance.integration.name,
        };
      }
    }
    hasNextPage = result.instances.pageInfo.hasNextPage;
    cursor = result.instances.pageInfo.endCursor;
  }
}
