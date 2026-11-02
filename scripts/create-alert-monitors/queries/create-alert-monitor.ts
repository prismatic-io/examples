/**
 * An alert monitor is a combination of an alert trigger (like "Execution Failed"), an instance's flow ID, and a user.
 */

import { GraphQLClient, gql } from "graphql-request";

interface CreateAlertMonitorResponse {
  createAlertMonitor: {
    alertMonitor: {
      id: string;
    };
    errors: {
      field: string;
      messages: string[];
    }[];
  };
}

const CREATE_ALERT_MONITOR_MUTATION = gql`
  mutation myCreateAlertMonitor(
    $name: String!
    $instanceId: ID!
    $flowConfigId: ID!
    $triggerId: ID!
    $userId: ID!
  ) {
    createAlertMonitor(
      input: {
        name: $name
        instance: $instanceId
        flowConfig: $flowConfigId
        triggers: [$triggerId]
        users: [$userId]
      }
    ) {
      alertMonitor {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

const createAlertMonitor = async ({
  client,
  alertMonitorName,
  instanceId,
  flowConfigId,
  triggerId,
  userId,
}: {
  client: GraphQLClient;
  alertMonitorName: string;
  instanceId: string;
  flowConfigId: string;
  triggerId: string;
  userId: string;
}) => {
  const result = await client.request<CreateAlertMonitorResponse>(
    CREATE_ALERT_MONITOR_MUTATION,
    {
      name: alertMonitorName,
      instanceId,
      flowConfigId,
      triggerId,
      userId,
    }
  );
  if (result.createAlertMonitor.errors.length) {
    throw new Error(JSON.stringify(result.createAlertMonitor.errors));
  }
};

export default createAlertMonitor;
