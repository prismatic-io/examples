import { gql } from "graphql-request";

export interface FailedExecution {
  id: string;
  startedAt: string;
  error: string;
  replays: { nodes: { id: string; startedAt: string }[] };
}

export interface GetFailedExecutionsResult {
  executionResults: {
    nodes: FailedExecution[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

export const GET_FAILED_EXECUTIONS = gql`
  query getFailedExecutions($instanceId: ID!, $startCursor: String) {
    executionResults(
      instance: $instanceId
      error_Isnull: false
      replayForExecution_Isnull: true
      after: $startCursor
    ) {
      nodes {
        id
        startedAt
        replays(error_Isnull: true) {
          nodes {
            id
            startedAt
          }
        }
        error
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export interface ReplayExecutionResult {
  replayExecution: {
    instanceExecutionResult: {
      id: string;
      startedAt: string;
    };
  };
}

export const REPLAY_EXECUTION = gql`
  mutation ($executionId: ID!) {
    replayExecution(input: { id: $executionId }) {
      instanceExecutionResult {
        id
        startedAt
      }
    }
  }
`;
