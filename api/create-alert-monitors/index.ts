/**
 * Please read README.md for instructions on how to run this script.
 */

import { GraphQLClient } from "graphql-request";
import fetchRetry from "fetch-retry";
import fetch from "isomorphic-fetch";
import {
  createAlertMonitor,
  deleteAlertMonitor,
  getAlertMonitors,
  getAlertTrigger,
  getInstances,
  getUser,
} from "./queries";

const API_ENDPOINT = process.env.PRISMATIC_URL
  ? `${process.env.PRISMATIC_URL}/api`
  : "https://app.prismatic.io/api";

const { PRISMATIC_API_KEY, ALERT_EMAIL_ADDRESS, DELETE_MONITORS } = process.env;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
if (!ALERT_EMAIL_ADDRESS && !DELETE_MONITORS) {
  throw new Error(
    "You must set an ALERT_EMAIL_ADDRESS environment variable, and that email address must be associated with an organization user."
  );
}
const client = new GraphQLClient(API_ENDPOINT, {
  headers: { Authorization: `Bearer ${PRISMATIC_API_KEY}` },
  fetch: fetchRetry(fetch, { retries: 5, retryDelay: 800 }),
});

const getAlertMonitorName = (flowName: string) =>
  `[Generated] Alert on Error - ${flowName.trim()}`;

const createMonitors = async () => {
  const user = await getUser({ client, email: `${ALERT_EMAIL_ADDRESS}` });
  const trigger = await getAlertTrigger({
    client,
    triggerName: "Execution Failed",
  });
  console.debug(
    `Setting up alert monitors using email "${user.email}" and trigger "${trigger.name}"\n`
  );

  console.debug("Fetching a list of instances...");
  const instances = await getInstances(client);
  console.debug(`  ...found ${instances.length} instances.\n`);

  for (const instance of instances) {
    const flowsWithoutMonitors = instance.flowConfigs.nodes.filter(
      (flowConfig) => {
        const monitors = flowConfig.monitors.nodes;
        const monitorName = getAlertMonitorName(flowConfig.flow.name);
        const hasMonitorAlready = Boolean(
          monitors.filter((monitor) => monitor.name === monitorName).length
        );
        return !hasMonitorAlready;
      }
    );
    console.debug(
      `Instance "${instance.name}" deployed to "${instance.customer.name}" has ${instance.flowConfigs.nodes.length} flows - ${flowsWithoutMonitors.length} are missing monitors.`
    );
    for (const flowConfig of flowsWithoutMonitors) {
      console.debug(`  Creating monitor for "${flowConfig.flow.name}" flow...`);
      await createAlertMonitor({
        client,
        alertMonitorName: getAlertMonitorName(flowConfig.flow.name),
        flowConfigId: flowConfig.id,
        instanceId: instance.id,
        triggerId: trigger.id,
        userId: user.id,
      });
    }
  }
};

/**
 * Delete all alert monitors that begin with "[Generated] Alert on Error - ".
 */
const deleteMonitors = async () => {
  const monitors = await getAlertMonitors({
    client,
    namePrefix: "[Generated] Alert on Error - ",
  });
  console.debug(`Found ${monitors.length} monitors to delete.\n`);
  for (const monitor of monitors) {
    console.debug(
      `Deleting monitor "${monitor.name}" for instance "${monitor.instance.name}" deployed to "${monitor.instance.customer.name}"...`
    );
    await deleteAlertMonitor({ client, monitorId: monitor.id });
  }
};

if (process.env.DELETE_MONITORS) {
  deleteMonitors();
} else {
  createMonitors();
}
