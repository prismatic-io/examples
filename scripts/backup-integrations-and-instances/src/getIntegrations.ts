import cliProgress from "cli-progress";
import { gql } from "graphql-request";
import client from "./client";

const integrationsQuery = gql`
  query GetIntegrations($cursor: String) {
    integrations(
      orderBy: { direction: ASC, field: CREATED_AT }
      after: $cursor
      first: 20
    ) {
      nodes {
        id
        customer {
          name
          externalId
        }
        definition(useLatestComponentVersions: true)
        avatarUrl
        category
        description
        documentation
        isCodeNative
        marketplaceConfiguration
        name
        overview
        instances {
          totalCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const countQuery = gql`
  {
    integrations {
      totalCount
    }
  }
`;

interface Integration {
  id: string;
  definition: string;
  customer: {
    name: string;
    externalId: string;
  };
  avatarUrl: string | null;
  category: string | null;
  description: string;
  documentation: string;
  isCodeNative: boolean;
  marketplaceConfiguration: string;
  name: string;
  overview: string;
  instances: {
    totalCount: number;
  };
}

interface IntegrationQueryResults {
  integrations: {
    nodes: Integration[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

async function getIntegrations(progressBar: cliProgress.SingleBar) {
  const countResponse = await client.request<{
    integrations: { totalCount: number };
  }>(countQuery);
  progressBar.setTotal(countResponse.integrations.totalCount);

  const integrations: Integration[] = [];
  let hasNextPage = false;
  let cursor: string = "";
  do {
    const response = await client.request<IntegrationQueryResults>(
      integrationsQuery,
      {
        cursor,
      }
    );
    integrations.push(...response.integrations.nodes);
    progressBar.increment(response.integrations.nodes.length);
    hasNextPage = response.integrations.pageInfo.hasNextPage;
    cursor = response.integrations.pageInfo.endCursor;
  } while (hasNextPage);

  progressBar.stop();

  return integrations;
}

export default getIntegrations;
