import { gql, GraphQLClient } from "graphql-request";

interface GetInstanceUsageArgs {
  client: GraphQLClient;
  instanceId: string;
  startDate: Date;
  endDate: Date;
}

interface UsageSnapshot {
  snapshotDate: string;
  successfulExecutionCount: number;
  failedExecutionCount: number;
  stepCount: number;
  spendMbSecs: number;
}

interface UsageSnapshotQueryResult {
  instanceDailyUsageMetrics: {
    nodes: UsageSnapshot[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

const GET_INSTANCE_USAGE_SNAPSHOTS = gql`
  query getInstanceComputeUsage(
    $instanceId: ID!
    $snapshotStart: Date!
    $snapshotEnd: Date!
    $startCursor: String
  ) {
    instanceDailyUsageMetrics(
      instance: $instanceId
      snapshotDate_Gte: $snapshotStart
      snapshotDate_Lte: $snapshotEnd
      after: $startCursor
      sortBy: { direction: ASC, field: SNAPSHOT_DATE }
    ) {
      nodes {
        snapshotDate
        successfulExecutionCount
        failedExecutionCount
        stepCount
        spendMbSecs
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const getInstanceUsage = async ({
  client,
  instanceId,
  startDate,
  endDate,
}: GetInstanceUsageArgs): Promise<UsageSnapshot[]> => {
  const instanceUsage: UsageSnapshot[] = [];

  let startCursor = "";
  let hasNextPage = false;

  do {
    const result = await client.request<UsageSnapshotQueryResult>(
      GET_INSTANCE_USAGE_SNAPSHOTS,
      {
        instanceId,
        snapshotStart: startDate.toISOString().slice(0, 10),
        snapshotEnd: endDate.toISOString().slice(0, 10),
        startCursor,
      }
    );
    instanceUsage.push(...result.instanceDailyUsageMetrics.nodes);
    startCursor = result.instanceDailyUsageMetrics.pageInfo.endCursor;
    hasNextPage = result.instanceDailyUsageMetrics.pageInfo.hasNextPage;
  } while (hasNextPage);

  return instanceUsage;
};
