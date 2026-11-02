/**
 * Please read README.md for instructions on how to run this script.
 */

import fetchRetry from "fetch-retry";
import { GraphQLClient } from "graphql-request";
import { parseArgs } from "node:util";
import {
  type FailedExecution,
  GET_FAILED_EXECUTIONS,
  type GetFailedExecutionsResult,
  REPLAY_EXECUTION,
  type ReplayExecutionResult,
} from "./queries";

const { values } = parseArgs({
  options: {
    "instance-id": { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});

const instanceId = values["instance-id"];
const dryRun = values["dry-run"];
if (!instanceId) {
  throw new Error(
    "You must provide the ID of the instance to replay failed executions for with --instance-id.",
  );
}

/**
 * Set up GraphQL Client. You must set a PRISMATIC_API_KEY environment variable.
 * For example, run
 *   PRISMATIC_API_KEY=$(prism me:token) npm run start
 */
const API_ENDPOINT = process.env.PRISMATIC_URL
  ? `${process.env.PRISMATIC_URL}/api`
  : "https://app.prismatic.io/api";

const { PRISMATIC_API_KEY } = process.env;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient(API_ENDPOINT, {
  headers: { Authorization: `Bearer ${PRISMATIC_API_KEY}` },
  fetch: fetchRetry(fetch, { retries: 5, retryDelay: 800 }),
});

// Loop over pages of failed executions
let startCursor = "";
let hasNextPage = false;
const failedExecutions: FailedExecution[] = [];
do {
  const result = await client.request<GetFailedExecutionsResult>(
    GET_FAILED_EXECUTIONS,
    { instanceId, startCursor },
  );
  failedExecutions.push(...result.executionResults.nodes);
  startCursor = result.executionResults.pageInfo.endCursor;
  hasNextPage = result.executionResults.pageInfo.hasNextPage;
} while (hasNextPage);

// Filter for executions that did not succeed in a subsequent replay
const failedExecutionsToReplay = failedExecutions.filter(
  (execution) => execution.replays.nodes.length === 0,
);
console.log(
  `Found ${failedExecutions.length} original failed executions, ${failedExecutionsToReplay.length} of which have not succeeded on a subsequent replay.\n`,
);

// Replay failed executions
for (const { id: executionId, startedAt } of failedExecutionsToReplay) {
  if (dryRun) {
    console.log(
      `[Dry run] Would replay failed execution ${executionId} (started at ${startedAt}).`,
    );
    continue;
  }
  console.log(`Replaying failed execution ${executionId}...`);
  const result = await client.request<ReplayExecutionResult>(REPLAY_EXECUTION, {
    executionId,
  });
  const replay = result.replayExecution.instanceExecutionResult;
  console.log(
    ` └ replay with execution ID ${replay.id} started at ${replay.startedAt}.\n`,
  );
}
