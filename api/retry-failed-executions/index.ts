import { GraphQLClient } from "graphql-request";
import {
  FailedExecution,
  GET_FAILED_EXECUTIONS,
  GetFailedExecutionsResult,
  REPLAY_EXECUTION,
  ReplayExecutionResult,
} from "./queries";
import fetch from "isomorphic-fetch";
import fetchRetry from "fetch-retry";

const INSTANCE_ID = "SW5z_REPLACE_ME";

/**
 * Set up GraphQL Client. You must set a PRISMATIC_API_KEY environment variable.
 * For example, run
 *   PRISMATIC_API_KEY=$(prism me:token) npm run start
 */
const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient("https://app.dev.prismatic-dev.io/api", {
  headers: { Authorization: `Bearer ${PRISMATIC_API_KEY}` },
  fetch: fetchRetry(fetch, { retries: 5, retryDelay: 800 }),
});

const main = async (instanceId: string) => {
  // Loop over pages of failed executions
  let startCursor = "";
  let hasNextPage = false;
  let failedExecutions: FailedExecution[] = [];
  do {
    const result = await client.request<GetFailedExecutionsResult>(
      GET_FAILED_EXECUTIONS,
      { instanceId, startCursor }
    );
    failedExecutions = [...failedExecutions, ...result.executionResults.nodes];
    startCursor = result.executionResults.pageInfo.endCursor;
    hasNextPage = result.executionResults.pageInfo.hasNextPage;
  } while (hasNextPage);

  // Filter for executions that did not succeed in a subsequent replay
  const failedExecutionsToReplay = failedExecutions.filter(
    (execution) => execution.replays.nodes.length === 0
  );
  console.log(
    `Found ${failedExecutions.length} original failed executions, ${failedExecutionsToReplay.length} of which have not succeeded on a subsequent replay.\n`
  );

  // Replay failed executions
  for (const failedExecution of failedExecutionsToReplay) {
    const { id: executionId } = failedExecution;
    console.log(`Replaying failed execution ${executionId}...`);
    const result = await client.request<ReplayExecutionResult>(
      REPLAY_EXECUTION,
      { executionId }
    );
    console.log(
      ` └ replay with execution ID ${result.replayExecution.instanceExecutionResult.id} started at ${result.replayExecution.instanceExecutionResult.startedAt}.\n`
    );
  }
};

main(INSTANCE_ID);
