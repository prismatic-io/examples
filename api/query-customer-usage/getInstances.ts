import { gql, GraphQLClient } from "graphql-request";

interface Instance {
  id: string;
  name: string;
  customer: {
    id: string;
    name: string;
  };
}

interface InstanceQueryResult {
  instances: {
    nodes: Instance[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

const GET_INSTANCES = gql`
  query ($startCursor: String) {
    instances(
      after: $startCursor
      isSystem: false
      sortBy: [
        { field: CUSTOMER, direction: ASC }
        { field: CREATED_AT, direction: ASC }
      ]
    ) {
      nodes {
        id
        name
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

export const getInstances = async (
  client: GraphQLClient
): Promise<Instance[]> => {
  const instances: Instance[] = [];
  let startCursor = "";
  let hasNextPage = false;
  do {
    const result = await client.request<InstanceQueryResult>(GET_INSTANCES, {
      startCursor,
    });
    instances.push(...result.instances.nodes);
    startCursor = result.instances.pageInfo.endCursor;
    hasNextPage = result.instances.pageInfo.hasNextPage;
  } while (hasNextPage);
  return instances;
};
