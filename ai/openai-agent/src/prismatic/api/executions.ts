import {
  OrganizationClient,
  CustomerClient,
  ExecutionResult,
  StepResult,
} from "../types";
import { decode } from "@msgpack/msgpack";
import fetch from "node-fetch";

/**
 * Get execution result details
 * @param client - The authenticated client (Organization or Customer)
 * @param executionId - The execution ID
 * @returns The execution result details
 */
export async function getExecutionResult(
  client: OrganizationClient | CustomerClient,
  executionId: string,
): Promise<ExecutionResult> {
  const query = `
    query getExecutionResult($executionId: ID!) {
      executionResult(id: $executionId) {
        id
        startedAt
        endedAt
        error
        status
      }
    }
  `;

  const data = await client.query(query, { executionId });
  return data.executionResult;
}

/**
 * Get and decode a specific step result from an execution
 * @param client - The authenticated client (Organization or Customer)
 * @param executionId - The execution ID
 * @param stepName - The name of the step to retrieve results for
 * @returns The decoded step result data
 */
export async function getStepResult(
  client: OrganizationClient | CustomerClient,
  executionId: string,
  stepName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const query = `
    query getStepResult($executionId: ID!, $stepName: String!) {
      executionResult(id: $executionId) {
        stepResults(stepName: $stepName) {
          nodes {
            stepName
            resultsUrl
          }
        }
      }
    }
  `;

  const data = await client.query(query, { executionId, stepName });
  const stepResult = data.executionResult?.stepResults?.nodes?.[0];

  if (!stepResult?.resultsUrl) {
    throw new Error(
      `No results found for step "${stepName}" in execution ${executionId}`,
    );
  }

  // Fetch the msgpack-encoded data from the presigned S3 URL
  const response = await fetch(stepResult.resultsUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch step results: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  // Decode the msgpack data
  const decoded = decode(new Uint8Array(buffer));

  return decoded;
}

/**
 * Get all step results for an execution
 * @param client - The authenticated client (Organization or Customer)
 * @param executionId - The execution ID
 * @returns Array of step results with their names
 */
export async function getAllStepResults(
  client: OrganizationClient | CustomerClient,
  executionId: string,
): Promise<StepResult[]> {
  const query = `
    query getAllStepResults($executionId: ID!) {
      executionResult(id: $executionId) {
        stepResults {
          nodes {
            stepName
            resultsUrl
          }
        }
      }
    }
  `;

  const data = await client.query(query, { executionId });
  const stepResults = data.executionResult?.stepResults?.nodes || [];

  // Fetch and decode all step results in parallel
  const decodedResults = await Promise.all(
    stepResults.map(async (step: { stepName: string; resultsUrl: string }) => {
      if (!step.resultsUrl) {
        return {
          stepName: step.stepName,
          data: null,
        };
      }

      try {
        const response = await fetch(step.resultsUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch results for step ${step.stepName}`);
        }

        const buffer = await response.arrayBuffer();
        const decoded = decode(new Uint8Array(buffer));

        return {
          stepName: step.stepName,
          data: decoded,
        };
      } catch (error) {
        console.error(
          `Error fetching results for step ${step.stepName}:`,
          error,
        );
        return {
          stepName: step.stepName,
          data: null,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );

  return decodedResults;
}
