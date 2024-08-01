import { gql } from "graphql-request";
import client from "./client";

const importIntegrationMutation = gql`
  mutation importIntegration($definition: String!) {
    importIntegration(input: { definition: $definition }) {
      integration {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

interface ImportIntegrationResponse {
  importIntegration: {
    integration: {
      id: string;
    };
  };
  errors: {
    field: string;
    messages: string;
  }[];
}

const publishIntegrationMutation = gql`
  mutation publishIntegration($integrationId: ID!) {
    publishIntegration(input: { id: $integrationId }) {
      integration {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

interface PublishIntegrationResponse {
  publishIntegration: {
    integration: {
      id: string;
    };
    errors: {
      field: string;
      messages: string;
    }[];
  };
}

interface ImportIntegrationParameters {
  definition: string;
}

const importIntegration = async ({
  definition,
}: ImportIntegrationParameters) => {
  // Import integration
  const importResponse = await client.request<ImportIntegrationResponse>(
    importIntegrationMutation,
    {
      definition,
    }
  );
  const { id: integrationId } = importResponse.importIntegration.integration;

  // Publish integration
  const publishResponse = await client.request<PublishIntegrationResponse>(
    publishIntegrationMutation,
    { integrationId }
  );
  const { id: versionId } = publishResponse.publishIntegration.integration;

  return versionId;
};

export default importIntegration;
