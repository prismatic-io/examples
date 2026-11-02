/**
 * Delete an existing alert monitor by ID
 */

import { GraphQLClient, gql } from "graphql-request";

const DELETE_ALERT_MONITOR_MUTATION = gql`
  mutation myDeleteAlertMonitor($monitorId: ID!) {
    deleteAlertMonitor(input: { id: $monitorId }) {
      errors {
        field
        messages
      }
    }
  }
`;

const deleteAlertMonitor = async ({
  client,
  monitorId,
}: {
  client: GraphQLClient;
  monitorId: string;
}) => await client.request(DELETE_ALERT_MONITOR_MUTATION, { monitorId });

export default deleteAlertMonitor;
