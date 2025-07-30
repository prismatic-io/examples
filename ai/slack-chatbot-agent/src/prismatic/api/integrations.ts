import { OrganizationClient, Integration } from "../types";

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
 * Deploy an integration
 * @param client - The authenticated OrganizationClient
 * @param integrationId - The integration ID to deploy
 * @returns The deployed integration
 */
export async function deployIntegration(
  client: OrganizationClient,
  integrationId: string,
): Promise<Integration> {
  const mutation = `
    mutation deployIntegration($id: ID!) {
      deployIntegration(input: { id: $id }) {
        integration {
          id
          name
          description
          versionNumber
        }
      }
    }
  `;

  const data = await client.query(mutation, { id: integrationId });
  return data.deployIntegration.integration;
}
