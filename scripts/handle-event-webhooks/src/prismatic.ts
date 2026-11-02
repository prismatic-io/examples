/**
 * Module to interact with Prismatic GraphQL API
 */

import { GraphQLClient, gql } from "graphql-request";
import config from "./config";

const query = gql`
  query myGetInstanceWebhooks($instanceId: ID!) {
    instance(id: $instanceId) {
      name
      customer {
        externalId
      }
      integration {
        id
        name
      }
      flowConfigs {
        nodes {
          id
          flow {
            id
            name
          }
          webhookUrl
        }
      }
    }
  }
`;

interface InstanceDetails {
  instance: {
    name: string;
    customer: {
      externalId: string;
    };
    integration: {
      id: string;
      name: string;
    };
    flowConfigs: {
      nodes: Array<{
        id: string;
        flow: {
          id: string;
          name: string;
        };
        webhookUrl: string;
      }>;
    };
  };
}

const client = new GraphQLClient(config.prismaticApiUrl, {
  headers: {
    Authorization: `Bearer ${config.prismaticApiToken}`,
  },
});

export const getInstanceDetails = async (instanceId: string) => {
  const data = await client.request<InstanceDetails>(query, { instanceId });
  return data.instance;
};
