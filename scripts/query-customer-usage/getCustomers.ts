import { gql, GraphQLClient } from "graphql-request";

/**
 * Get a list of customers
 */
interface Customer {
  id: string;
  externalId: string;
  name: string;
}

interface CustomerQueryResult {
  customers: {
    nodes: Customer[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

const GET_CUSTOMERS = gql`
  query ($startCursor: String) {
    customers(
      after: $startCursor
      isSystem: false
      orderBy: { field: NAME, direction: ASC }
    ) {
      nodes {
        id
        externalId
        name
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const getCustomers = async (client: GraphQLClient) => {
  const customers: Customer[] = [];
  let startCursor = "";
  let hasNextPage = false;
  do {
    const result = await client.request<CustomerQueryResult>(GET_CUSTOMERS, {
      startCursor,
    });
    customers.push(...result.customers.nodes);
    startCursor = result.customers.pageInfo.endCursor;
    hasNextPage = result.customers.pageInfo.hasNextPage;
  } while (hasNextPage);
  return customers;
};
