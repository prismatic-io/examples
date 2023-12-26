/**
 * Alert triggers like "Execution Failed" each have their own ID.
 * This function gets the ID and name of the alert trigger with the given name.
 */

import { GraphQLClient, gql } from "graphql-request";

const GET_ALERT_TRIGGERS_QUERY = gql`
  {
    alertTriggers {
      nodes {
        id
        name
      }
    }
  }
`;

interface UserResponse {
  alertTriggers: {
    nodes: {
      id: string;
      name: string;
    }[];
  };
}

const getUser = async ({
  client,
  triggerName,
}: {
  client: GraphQLClient;
  triggerName: string;
}) => {
  const { alertTriggers } = await client.request<UserResponse>(
    GET_ALERT_TRIGGERS_QUERY
  );
  const alertTrigger = alertTriggers.nodes.find(
    (trigger) => trigger.name === triggerName
  );
  if (!alertTrigger) {
    throw new Error(`No alert trigger found with name ${triggerName}`);
  }
  return alertTrigger;
};

export default getUser;
