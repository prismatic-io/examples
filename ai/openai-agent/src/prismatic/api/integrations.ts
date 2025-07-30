import {
  OrganizationClient,
  Integration,
  IntegrationWithInstance,
} from "../types";

/**
 * List all integrations for an organization
 * @param client - The authenticated OrganizationClient
 * @returns Array of integrations
 */
export async function listIntegrations(
  client: OrganizationClient,
): Promise<Integration[]> {
  const query = `
    query listIntegrations {
      integrations {
        nodes {
          id
          name
          description
          versionNumber
        }
      }
    }
  `;

  const data = await client.query(query);
  return data.integrations?.nodes || [];
}

/**
 * Get a specific integration by ID
 * @param client - The authenticated OrganizationClient
 * @param integrationId - The integration ID
 * @returns The integration details
 */
export async function getIntegration(
  client: OrganizationClient,
  integrationId: string,
): Promise<Integration> {
  const query = `
    query getIntegration($id: ID!) {
      integration(id: $id) {
        id
        name
        description
        versionNumber
      }
    }
  `;

  const data = await client.query(query, { id: integrationId });
  return data.integration;
}

/**
 * Get integration with system instance details
 * @param client - The authenticated OrganizationClient
 * @param integrationId - The integration ID
 * @returns The integration with system instance details
 */
export async function getIntegrationWithSystemInstance(
  client: OrganizationClient,
  integrationId: string,
): Promise<IntegrationWithInstance> {
  const query = `
    query getIntegration($id: ID!) {
      integration(id: $id) {
        id
        name
        description
        versionNumber
        instances(isSystem: true, sortBy: {field: VERSION, direction: DESC}, first: 1) {
          nodes {
            id
            name
            customer {
              name
              id
            }
            deployedVersion
            lastDeployedAt
            enabled
            needsDeploy
            instanceType
            flowConfigs {
              nodes {
                webhookUrl
                flow {
                  id
                  stableId
                  stableKey
                  name
                  description
                  schemas
                  isSynchronous
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await client.query(query, { id: integrationId });
  return data.integration;
}
