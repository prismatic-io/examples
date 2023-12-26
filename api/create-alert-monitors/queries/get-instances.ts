/**
 * Get a list of all enabled and non-system instances, including their flows and alert monitors.
 */
import { GraphQLClient, gql } from "graphql-request";

interface Instance {
  id: string;
  name: string;
  flowConfigs: {
    nodes: {
      id: string;
      flow: {
        name: string;
      };
      monitors: {
        nodes: {
          id: string;
          name: string;
          groups: {
            nodes: {
              id: string;
            }[];
          };
        }[];
      };
    }[];
  };
  customer: {
    id: string;
    name: string;
  };
}

interface InstanceResult {
  instances: {
    nodes: Instance[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

const GET_INSTANCES_QUERY = gql`
  query myGetInstancesQuery($cursor: String) {
    instances(
      isSystem: false
      enabled: true
      sortBy: { direction: ASC, field: CREATED_AT }
      after: $cursor
    ) {
      nodes {
        id
        name
        flowConfigs {
          nodes {
            id
            flow {
              name
            }
            monitors {
              nodes {
                id
                name
                groups {
                  nodes {
                    id
                  }
                }
              }
            }
          }
        }
        customer {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const getInstances = async (client: GraphQLClient) => {
  let cursor: string = "";
  let hasNextPage = false;
  let instances: Instance[] = [];
  // Loop over pages of all enabled and non-system instances
  do {
    const result = await client.request<InstanceResult>(GET_INSTANCES_QUERY, {
      cursor,
    });
    instances = [...instances, ...result.instances.nodes];
    cursor = result.instances.pageInfo.endCursor;
    hasNextPage = result.instances.pageInfo.hasNextPage;
  } while (hasNextPage);
  return instances;
};

export default getInstances;
