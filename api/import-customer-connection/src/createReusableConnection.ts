import { ExistingConnection } from "./fetchExistingConnection";
import { generateJwt } from "./jwt";
import { User } from "./users";
import getEnvironmentVariables from "./environment";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface CreateReusableConnectionProps {
  existingConnection: ExistingConnection;
  user: User;
}

const LIST_SCOPED_CONFIG_VARIABLES_QUERY = `
  query listScopedConfigVariables {
      scopedConfigVariables(variableScope: "user") {
          nodes {
              id
              key
              treeLocation
              stableKey
              ancestors {
                  nodes {
                      id
                      stableKey
                  }
              }
              user {
                  id
                  externalId
              }
          }
      }
  }
`;

interface ListScopedConfigVariablesResponse {
  data: {
    scopedConfigVariables: {
      nodes: Array<{
        id: string;
        key: string;
        treeLocation: string;
        stableKey: string;
        ancestors: {
          nodes: Array<{
            id: string;
            stableKey: string;
          }>;
        };
        user: {
          id: string;
          externalId: string;
        };
      }>;
    };
  };
}

const CREATE_REUSABLE_CONNECTION_MUTATION = `
  mutation createUserActivatedConnection(
    $name: String!
    $description: String!
    $stableKey: String!
    $parent: ID!
    $inputs: [InputExpression]
  ) {
    createScopedConfigVariable(
      input: {
        key: $name
        description: $description
        stableKey: $stableKey
        variableScope: "user"
        managedBy: "user"
        parent: $parent
        inputs: $inputs
      }
    ) {
      scopedConfigVariable {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

interface CreateReusableConnectionResponse {
  data: {
    createScopedConfigVariable: {
      scopedConfigVariable: {
        id: string;
      };
      errors: Array<{
        field: string;
        messages: string[];
      }>;
    };
  };
}

const UPDATE_SCOPED_OAUTH_CONNECTION_MUTATION = `
  mutation updateOAuthConnection(
      $scopedConnectionId: ID!
      $accessToken: String!
      $refreshToken: String!
      $expiresAt: DateTime!
      $expiresIn: Int!
  ) {
      updateScopedOAuth2Connection(
          input: {
              id: $scopedConnectionId
              accessToken: $accessToken
              refreshToken: $refreshToken
              refreshAt: $expiresAt
              expiresIn: $expiresIn
          }
      ) {
          scopedConfigVariable { id }
          errors {
              field
              messages
          }
      }
  }
`;

export const createReusableConnection = async ({
  existingConnection,
  user,
}: CreateReusableConnectionProps) => {
  const {
    PRISMATIC_ORGANIZATION_ID,
    PRISMATIC_BASE_URL,
    CONNECTION_STABLE_KEY,
  } = getEnvironmentVariables();

  const jwt = generateJwt({
    sub: user.externalId,
    userName: user.name,
    organization: PRISMATIC_ORGANIZATION_ID,
    customerExternalId: user.customerId,
    customerName: user.customerName,
  });

  console.debug(`\nUser ${user.externalId} (${user.name})`);
  console.debug(` - Authenticating user with Prismatic.`);

  await fetch(new URL("/embedded/authenticate", PRISMATIC_BASE_URL), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  const prismaticClient = axios.create({
    baseURL: PRISMATIC_BASE_URL,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
  });

  // Check if a connection already exists
  const listScvResponse =
    await prismaticClient.post<ListScopedConfigVariablesResponse>("/api", {
      query: LIST_SCOPED_CONFIG_VARIABLES_QUERY,
    });

  const scopedConfigVars =
    listScvResponse.data.data.scopedConfigVariables.nodes;

  // We need to see if there's an existing "LEAF" node that has an ancestor with the stable key we're looking for
  const existingConnectionInPrismatic = scopedConfigVars
    .filter(({ treeLocation }) => treeLocation === "LEAF")
    .find(
      (leafNode) =>
        leafNode.user.externalId === user.externalId &&
        leafNode.ancestors.nodes[0]?.stableKey === CONNECTION_STABLE_KEY,
    );

  if (existingConnectionInPrismatic) {
    console.debug(
      ` - User connection with ID ${existingConnectionInPrismatic.id} already exists. Skipping creation.`,
    );
    return;
  }

  const parentConnection = scopedConfigVars
    .filter(({ treeLocation }) => treeLocation === "ROOT")
    .find((node) => node.stableKey === CONNECTION_STABLE_KEY);

  if (!parentConnection) {
    throw new Error(
      `Unable to find parent connection with stable key ${CONNECTION_STABLE_KEY}`,
    );
  }

  console.debug(
    ` - Creating reusable connection for user ${user.externalId} (${user.name}) under parent connection ${parentConnection.id}.`,
  );

  const createReusableConnectionResponse =
    await prismaticClient.post<CreateReusableConnectionResponse>("/api", {
      query: CREATE_REUSABLE_CONNECTION_MUTATION,
      variables: {
        name: `${parentConnection.key} for ${user.name}`,
        description: `Imported connection for ${user.name}`,
        stableKey: uuidv4(), // We generate a random UUID for this LEAF node
        parent: parentConnection.id,
        inputs: [],
      },
    });

  const scopedConnectionId =
    createReusableConnectionResponse.data.data.createScopedConfigVariable
      .scopedConfigVariable.id;

  console.debug(
    ` - Updating reusable connection with ID ${scopedConnectionId} with OAuth information\n`,
  );

  await prismaticClient.post("/api", {
    query: UPDATE_SCOPED_OAUTH_CONNECTION_MUTATION,
    variables: {
      scopedConnectionId,
      accessToken: existingConnection.accessToken,
      refreshToken: existingConnection.refreshToken,
      expiresAt: "2000-01-01T00:00:00.000Z", // Use a date in the past to force the OAuth service to refresh immediately
      expiresIn: 60,
    },
  });
};
