import { gql } from "graphql-request";
import client from "./client";

interface Instance {
  id: string;
  customer: {
    id: string;
    name: string;
    externalId: string;
  };
  labels: any[];
  lastDeployedAt: Date;
  configVariables: {
    nodes: unknown[];
  };
}

interface IntegrationQueryResults {
  instances: {
    nodes: Instance[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

const instanceQuery = gql`
  query GetInstanceByIntegration($integrationId: ID!, $cursor: String) {
    instances(
      integration: $integrationId
      after: $cursor
      orderBy: { direction: ASC, field: CREATED_AT }
    ) {
      nodes {
        id
        name
        customer {
          id
          name
          externalId
        }
        labels
        lastDeployedAt
        configVariables {
          nodes {
            requiredConfigVariable {
              key
            }
            authorizeUrl
            refreshAt
            value
            scheduleType
            timeZone
            meta
            inputs {
              nodes {
                name
                value
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

async function getInstancesByIntegration(integrationId: string) {
  const instances: Instance[] = [];
  let hasNextPage = false;
  let cursor: string = "";
  do {
    const response = await client.request<IntegrationQueryResults>(
      instanceQuery,
      {
        integrationId,
        cursor,
      }
    );
    instances.push(...response.instances.nodes);
    hasNextPage = response.instances.pageInfo.hasNextPage;
    cursor = response.instances.pageInfo.endCursor;
  } while (hasNextPage);
  return instances;
}

export default getInstancesByIntegration;
