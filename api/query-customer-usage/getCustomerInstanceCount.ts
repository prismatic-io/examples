/**
 * Get customer instance count over a series of days
 */

import { gql, GraphQLClient } from "graphql-request";
import { getDaysArray } from "./util";

interface UsageSnapshot {
  snapshotTime: string;
  deployedInstanceCount: number;
  deployedUniqueIntegrationCount: number;
}

interface UsageQueryResult {
  customerTotalUsageMetrics: {
    nodes: UsageSnapshot[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

const GET_CUSTOMER_USAGE = gql`
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

interface GetCustomerInstanceCountArgs {
  client: GraphQLClient;
  customerId: string;
  startDate: Date;
  endDate: Date;
}

interface GetCustomerInstanceCountArgsResult {
  date: string;
  averageDeployedInstanceCount: number;
  averageUniqueIntegrationCount: number;
}

export const getCustomerInstanceCount = async ({
  client,
  customerId,
  startDate,
  endDate,
}: GetCustomerInstanceCountArgs): Promise<
  GetCustomerInstanceCountArgsResult[]
> => {
  let usageSnapshots: UsageSnapshot[] = [];

  let startCursor = "";
  let hasNextPage = false;

  // This will fill usageSnapshots with a large array that looks like
  // {
  //   snapshotTime: '2024-12-05T03:26:37.529783+00:00',
  //   deployedInstanceCount: 8,
  //   deployedUniqueIntegrationCount: 8
  // }
  do {
    const result = await client.request<UsageQueryResult>(GET_CUSTOMER_USAGE, {
      customerId,
      snapshotStart: startDate,
      snapshotEnd: endDate,
      startCursor,
    });
    usageSnapshots.push(...result.customerTotalUsageMetrics.nodes);
    startCursor = result.customerTotalUsageMetrics.pageInfo.endCursor;
    hasNextPage = result.customerTotalUsageMetrics.pageInfo.hasNextPage;
  } while (hasNextPage);

  const results: GetCustomerInstanceCountArgsResult[] = [];

  for (const currentDate of getDaysArray(startDate, endDate)) {
    const snapshotsForDay = usageSnapshots.filter((us) => {
      const snapshotDate = new Date(us.snapshotTime);
      return (
        snapshotDate.getFullYear() === currentDate.getFullYear() &&
        snapshotDate.getMonth() === currentDate.getMonth() &&
        snapshotDate.getDate() === currentDate.getDate()
      );
    });
    if (snapshotsForDay.length) {
      const averageDeployedInstanceCount =
        snapshotsForDay.reduce(
          (sum, snapshot) => sum + snapshot.deployedInstanceCount,
          0
        ) / snapshotsForDay.length;
      const averageUniqueIntegrationCount =
        snapshotsForDay.reduce(
          (sum, snapshot) => sum + snapshot.deployedInstanceCount,
          0
        ) / snapshotsForDay.length;
      results.push({
        date: currentDate.toISOString().slice(0, 10),
        averageDeployedInstanceCount,
        averageUniqueIntegrationCount,
      });
    }
  }

  return results;
};
