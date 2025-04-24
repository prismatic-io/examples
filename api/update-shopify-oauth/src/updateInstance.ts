import { gql, type GraphQLClient } from "graphql-request";

interface UpdateInstanceIntegrationVersionProps {
  client: GraphQLClient;
  instanceId: string;
  integrationVersionId: string;
}

export const updateInstanceIntegrationVersion = async ({
  client,
  instanceId,
  integrationVersionId,
}: UpdateInstanceIntegrationVersionProps) =>
  await client.request(
    gql`
      mutation ($instanceId: ID!, $integrationVersionId: ID!) {
        updateInstance(
          input: { id: $instanceId, integration: $integrationVersionId }
        ) {
          errors {
            field
            messages
          }
        }
      }
    `,
    { instanceId, integrationVersionId }
  );

interface UpdateInstanceConfigurationProps {
  client: GraphQLClient;
  instanceId: string;
  domain: string;
}
export const updateInstanceConfiguration = async ({
  client,
  instanceId,
  domain,
}: UpdateInstanceConfigurationProps) => {
  const configVariables = [
    {
      key: "Shopify Connection",
      values: JSON.stringify([
        { name: "domain", type: "value", value: domain },
      ]),
    },
  ];

  await client.request(
    gql`
      mutation (
        $instanceId: ID!
        $configVariables: [InputInstanceConfigVariable]
      ) {
        updateInstanceConfigVariables(
          input: { id: $instanceId, configVariables: $configVariables }
        ) {
          instance {
            id
          }
          errors {
            field
            messages
          }
        }
      }
    `,
    { instanceId, configVariables }
  );
};

interface DeployInstanceProps {
  client: GraphQLClient;
  instanceId: string;
}
export const deployInstance = async ({
  client,
  instanceId,
}: DeployInstanceProps) =>
  await client.request(
    gql`
      mutation ($instanceId: ID!) {
        deployInstance(input: { id: $instanceId }) {
          errors {
            field
            messages
          }
        }
      }
    `,
    { instanceId }
  );
