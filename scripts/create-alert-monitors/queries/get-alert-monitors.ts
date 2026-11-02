/**
 * Get all alert monitors that begin with "[Generated] Alert on Error - ".
 */

import { GraphQLClient, gql } from "graphql-request";

interface AlertMonitor {
  id: string;
  name: string;
  instance: {
    name: string;
    customer: { name: string };
  };
}

interface AlertMonitorResult {
  alertMonitors: {
    nodes: AlertMonitor[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}

const GET_ALERT_MONITORS_QUERY = gql`
  query myGetAlertMonitors($cursor: String, $namePrefix: String) {
    alertMonitors(
      name_Icontains: $namePrefix
      orderBy: { direction: ASC, field: CREATED_AT }
      after: $cursor
    ) {
      nodes {
        id
        name
        instance {
          name
          customer {
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const getAlertMonitors = async ({
  client,
  namePrefix,
}: {
  client: GraphQLClient;
  namePrefix: string;
}) => {
  let cursor: string = "";
  let hasNextPage = false;
  let alertMonitors: AlertMonitor[] = [];
  // Loop over pages of all alert monitors
  do {
    const result = await client.request<AlertMonitorResult>(
      GET_ALERT_MONITORS_QUERY,
      { cursor, namePrefix }
    );
    alertMonitors = [...alertMonitors, ...result.alertMonitors.nodes];
    cursor = result.alertMonitors.pageInfo.endCursor;
    hasNextPage = result.alertMonitors.pageInfo.hasNextPage;
  } while (hasNextPage);
  return alertMonitors;
};

export default getAlertMonitors;
