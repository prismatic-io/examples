import { gql } from "graphql-request";

export const GET_CUSTOMERS = gql`
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

export const GET_CUSTOMER_USAGE = gql`
  query (
    $customerId: ID!
    $snapshotStart: DateTime
    $snapshotEnd: DateTime
    $startCursor: String
  ) {
    customerTotalUsageMetrics(
      customer: $customerId
      sortBy: { direction: ASC, field: SNAPSHOT_TIME }
      snapshotTime_Gte: $snapshotStart
      snapshotTime_Lte: $snapshotEnd
      after: $startCursor
    ) {
      nodes {
        snapshotTime
        deployedInstanceCount
        deployedUniqueIntegrationCount
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
