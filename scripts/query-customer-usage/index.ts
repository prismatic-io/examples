/**
 * Please read README.md for instructions on how to run this script.
 */

import fetchRetry from "fetch-retry";
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { GraphQLClient } from "graphql-request";
import papaparse from "papaparse";
import { getCustomerInstanceCount } from "./getCustomerInstanceCount";
import { getCustomers } from "./getCustomers";
import { getInstances } from "./getInstances";
import { getInstanceUsage } from "./getInstanceUsage";

const { values } = parseArgs({
  options: {
    "start-date": { type: "string" },
    "end-date": { type: "string" },
  },
});

const parseDate = (value: string | undefined, name: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`You must provide --${name} in YYYY-MM-DD format.`);
  }
  const date = new Date(value); // YYYY-MM-DD strings are parsed as midnight UTC
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid --${name}: ${value}`);
  }
  return date;
};

const startDate = parseDate(values["start-date"], "start-date");
const endDate = parseDate(values["end-date"], "end-date");
if (startDate > endDate) {
  throw new Error("--start-date must be on or before --end-date.");
}

/**
 * Set up GraphQL Client. You must set a PRISMATIC_API_KEY environment variable.
 * For example, run
 *   PRISMATIC_API_KEY=$(prism me:token) npm run start
 */
const API_ENDPOINT = process.env.PRISMATIC_URL
  ? `${process.env.PRISMATIC_URL}/api`
  : "https://app.prismatic.io/api";

const { PRISMATIC_API_KEY } = process.env;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient(API_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${PRISMATIC_API_KEY}`,
  },
  fetch: fetchRetry(fetch, {
    retries: 5,
    retryDelay: 800,
  }),
});

interface CustomerInstanceUsage {
  "Customer ID": string;
  "Customer Name": string;
  Date: string;
  "Deployed Instances": number;
  "Unique Integrations": number;
}

interface InstanceExecutionData {
  "Customer ID": string;
  "Customer Name": string;
  "Instance ID": string;
  "Instance Name": string;
  Date: string;
  "Successful Executions": number;
  "Failed Executions": number;
  "Step Count": number;
  "Execution Mb-Seconds": number;
}

// Fetch a list of all customers
const customers = await getCustomers(client);

// Loop over all customers and fetch deployed instance data
const customerInstanceUsage: CustomerInstanceUsage[] = [];

for (const customer of customers) {
  console.debug(`Getting instance count data for ${customer.name}...`);
  const customerUsage = await getCustomerInstanceCount({
    client,
    customerId: customer.id,
    startDate,
    endDate,
  });
  customerInstanceUsage.push(
    ...customerUsage.map((cu) => ({
      "Customer ID": customer.id,
      "Customer Name": customer.name,
      Date: cu.date,
      "Deployed Instances": cu.averageDeployedInstanceCount,
      "Unique Integrations": cu.averageUniqueIntegrationCount,
    })),
  );
}

// Write out instance usage data to a CSV file
const instanceCsvData = papaparse.unparse(customerInstanceUsage, {
  header: true,
});
writeFileSync(`./customer-instance-data.csv`, instanceCsvData);

// Fetch a list of all instances
const instances = await getInstances(client);

const instanceExecutionData: InstanceExecutionData[] = [];

for (const instance of instances) {
  console.debug(
    `Getting instance compute data for ${instance.customer.name} / ${instance.name}...`,
  );
  const instanceUsage = await getInstanceUsage({
    client,
    instanceId: instance.id,
    startDate,
    endDate,
  });
  instanceExecutionData.push(
    ...instanceUsage.map((instanceUsageDay) => ({
      "Customer ID": instance.customer.id,
      "Customer Name": instance.customer.name,
      "Instance ID": instance.id,
      "Instance Name": instance.name,
      Date: instanceUsageDay.snapshotDate,
      "Successful Executions": instanceUsageDay.successfulExecutionCount,
      "Failed Executions": instanceUsageDay.failedExecutionCount,
      "Step Count": instanceUsageDay.stepCount,
      "Execution Mb-Seconds": instanceUsageDay.spendMbSecs,
    })),
  );
}

// Write out instance execution compute data to a CSV file
const computeCsvData = papaparse.unparse(instanceExecutionData, {
  header: true,
});
writeFileSync(`./instance-compute-data.csv`, computeCsvData);
