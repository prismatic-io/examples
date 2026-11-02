import { gql } from "graphql-request";
import client from "./client";

const getCustomerByExternalIdQuery = gql`
  query getCustomerByExternalId($externalId: String!) {
    customers(externalId: $externalId) {
      nodes {
        id
      }
    }
  }
`;

interface GetCustomerByExternalIdResponse {
  customers: {
    nodes: [
      {
        id: string;
      }
    ];
  };
}

const createInstanceMutation = gql`
  mutation createInstance(
    $customerId: ID!
    $instanceName: String!
    $integrationVersionId: ID!
    $configVars: [InputInstanceConfigVariable]
  ) {
    createInstance(
      input: {
        customer: $customerId
        integration: $integrationVersionId
        name: $instanceName
        configVariables: $configVars
      }
    ) {
      instance {
        id
        configVariables {
          nodes {
            id
            requiredConfigVariable {
              key
            }
          }
        }
      }
      errors {
        field
        messages
      }
    }
  }
`;

interface CreateInstanceMutationResponse {
  createInstance: {
    instance: {
      id: string;
      configVariables: {
        nodes: {
          id: string;
          requiredConfigVariable: { key: string };
        }[];
      };
    };
  };
}

const importOAuthConnectionMutation = gql`
  mutation (
    $configVarId: ID!
    $additionalTokenFields: String
    $refreshAt: DateTime
  ) {
    updateOAuth2Connection(
      input: {
        id: $configVarId
        status: "active"
        tokenType: "bearer"
        additionalTokenFields: $additionalTokenFields
        refreshAt: $refreshAt
      }
    ) {
      instanceConfigVariable {
        status
        meta
      }
      errors {
        field
        messages
      }
    }
  }
`;

interface ImportOAuthConnectionResponse {
  updateOAuth2Connection: {
    instanceConfigVariable: {
      status: string;
      meta: string;
    };
    errors: [];
  };
}

const deployInstanceMutation = gql`
  mutation ($instanceId: ID!) {
    deployInstance(input: { id: $instanceId }) {
      instance {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

interface DeployInstanceParameters {
  customerExternalId: string;
  integrationVersionId: string;
  instanceName: string;
  configVariables: any[];
}

async function deployInstance({
  customerExternalId,
  integrationVersionId,
  configVariables,
  instanceName,
}: DeployInstanceParameters) {
  const getCustomerResponse =
    await client.request<GetCustomerByExternalIdResponse>(
      getCustomerByExternalIdQuery,
      { externalId: customerExternalId }
    );
  const { id: customerId } = getCustomerResponse.customers.nodes[0];

  const parsedConfigVariables = configVariables.map((c) => {
    if (c.value) {
      // Standard config variable
      return { key: c.requiredConfigVariable.key, value: c.value };
    } else {
      // Connection config variable
      return {
        key: c.requiredConfigVariable.key,
        values: JSON.stringify(
          c.inputs.nodes.map((input: any) => ({
            type: "value",
            ...input,
          }))
        ),
      };
    }
  });

  const createInstanceResponse =
    await client.request<CreateInstanceMutationResponse>(
      createInstanceMutation,
      {
        customerId,
        instanceName,
        integrationVersionId,
        configVars: parsedConfigVariables,
      }
    );

  // Import each of the OAuth connections
  const oauthConfigVars = configVariables.filter((c) => c.authorizeUrl);
  for (const oauthConfigVar of oauthConfigVars) {
    const configVarId =
      createInstanceResponse.createInstance.instance.configVariables.nodes.find(
        (cv) =>
          cv.requiredConfigVariable.key ===
          oauthConfigVar.requiredConfigVariable.key
      )?.id;
    const tokenData = JSON.parse(oauthConfigVar.meta).token;
    await client.request<ImportOAuthConnectionResponse>(
      importOAuthConnectionMutation,
      {
        configVarId,
        additionalTokenFields: JSON.stringify(tokenData),
        refreshAt: oauthConfigVar.refreshAt,
      }
    );
  }

  await client.request(deployInstanceMutation, {
    instanceId: createInstanceResponse.createInstance.instance.id,
  });
}

export default deployInstance;
