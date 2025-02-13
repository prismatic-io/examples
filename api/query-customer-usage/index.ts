import { ArgumentParser } from "argparse";
import fetchRetry from "fetch-retry";
import fs from "fs";
import { GraphQLClient } from "graphql-request";
import papaparse from "papaparse";
import { getCustomerInstanceCount } from "./getCustomerInstanceCount";
import { getCustomers } from "./getCustomers";
import { getInstances } from "./getInstances";
import { getInstanceUsage } from "./getInstanceUsage";

const parser = new ArgumentParser({
  description: "Generate usage data for customers' instances.",
});
parser.add_argument("start-date", {
  type: String,
  help: "Start date for report",
});
parser.add_argument("end-date", {
  type: String,
  help: "End date for report",
});

const args = parser.parse_args();
const startDate = new Date(args["start-date"]);
const endDate = new Date(args["end-date"]);

/**
 * Set up GraphQL Client. You must set a PRISMATIC_API_KEY environment variable.
 * For example, run
 *   PRISMATIC_API_KEY=$(prism me:token) npm run start
 */
const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient("https://app.prismatic.io/api", {
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
  Date: String;
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

async function main() {
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
      }))
    );
  }

  // Write out instance usage data to a CSV file
  const instanceCsvData = papaparse.unparse(customerInstanceUsage, {
    header: true,
  });
  fs.writeFileSync(`./customer-instance-data.csv`, instanceCsvData);

  // Fetch a list of all instances
  const instances = await getInstances(client);

  const instanceExecutionData: InstanceExecutionData[] = [];

  for (const instance of instances) {
    console.debug(
      `Getting instance compute data for ${instance.customer.name} / ${instance.name}...`
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
      }))
    );
  }

  // Write out instance execution compute data to a CSV file
  const computeCsvData = papaparse.unparse(instanceExecutionData, {
    header: true,
  });
  fs.writeFileSync(`./instance-compute-data.csv`, computeCsvData);
}

main();
