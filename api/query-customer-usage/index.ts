import { GraphQLClient } from "graphql-request";
import { GET_CUSTOMERS, GET_CUSTOMER_USAGE } from "./queries";
import papaparse from "papaparse";
import fs from "fs";
import fetch from "isomorphic-fetch";
import fetchRetry from "fetch-retry";

const year = 2023;

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

/**
 * Get a list of customers
 */
interface Customer {
  id: string;
  externalId: string;
  name: string;
}
interface CustomerQueryResult {
  customers: {
    nodes: Customer[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}
const getCustomers = async () => {
  let customers: Customer[] = [];
  let startCursor = "";
  let hasNextPage = false;
  do {
    const result = await client.request<CustomerQueryResult>(GET_CUSTOMERS, {
      startCursor,
    });
    customers = [...customers, ...result.customers.nodes];
    startCursor = result.customers.pageInfo.endCursor;
    hasNextPage = result.customers.pageInfo.hasNextPage;
  } while (hasNextPage);
  return customers;
};

/**
 * Get customer usage per month for a given year, averaging number of deployed
 * instances over the number of days in each month
 */
interface UsageSnapshot {
  snapshotTime: string;
  deployedInstanceCount: number;
  deployedUniqueIntegrationCount: number;
}
interface UsageQueryResult {
  customerTotalUsageMetrics: {
    nodes: UsageSnapshot[];
    pageInfo: { endCursor: string; hasNextPage: boolean };
  };
}
const getCustomerUsage = async (customerId: string, year: number) => {
  let usageSnapshots: UsageSnapshot[][] = [];
  for (let i = 0; i < 12; i++) {
    usageSnapshots.push([]);
  }
  let startCursor = "";
  let hasNextPage = false;
  do {
    const result = await client.request<UsageQueryResult>(GET_CUSTOMER_USAGE, {
      customerId,
      snapshotStart: `${year}-01-01T00:00:00.000Z`,
      snapshotEnd: `${year}-12-31T23:59:59.999Z`,
      startCursor,
    });
    for (const usageSnapshot of result.customerTotalUsageMetrics.nodes) {
      const month = new Date(usageSnapshot.snapshotTime).getMonth();
      usageSnapshots[month].push(usageSnapshot);
    }
    startCursor = result.customerTotalUsageMetrics.pageInfo.endCursor;
    hasNextPage = result.customerTotalUsageMetrics.pageInfo.hasNextPage;
  } while (hasNextPage);
  const averages: (UsageSnapshot & { month: number })[] = [];
  for (let i = 0; i < 12; i++) {
    const month = i + 1;
    const snapshots = usageSnapshots[i];
    const instanceCountSum = snapshots.reduce(
      (sum, snapshot) => sum + snapshot.deployedInstanceCount,
      0
    );
    const uniqueIntegrationCountSum = snapshots.reduce(
      (sum, snapshot) => sum + snapshot.deployedUniqueIntegrationCount,
      0
    );
    const hoursInMonth = new Date(year, month, 0).getDate() * 24;
    averages.push({
      snapshotTime: `${year}-${month}`,
      month,
      deployedInstanceCount: instanceCountSum / hoursInMonth,
      deployedUniqueIntegrationCount: uniqueIntegrationCountSum / hoursInMonth,
    });
  }
  return averages;
};

interface CustomerUsage {
  "Customer ID": string;
  "Customer Name": string;
  "Usage Year": number;
  "Usage Month": number;
  "Deployed Instances": number;
  "Unique Integrations": number;
}

const main = async (year: number) => {
  const customers = await getCustomers();
  const usageData: CustomerUsage[] = [];
  for (const customer of customers) {
    console.log(`Getting usage for ${customer.name}...`);
    const yearlyUsage = await getCustomerUsage(customer.id, year);
    for (const monthlyUsage of yearlyUsage) {
      usageData.push({
        "Customer ID": customer.externalId,
        "Customer Name": customer.name,
        "Usage Year": year,
        "Usage Month": monthlyUsage.month,
        "Deployed Instances": monthlyUsage.deployedInstanceCount,
        "Unique Integrations": monthlyUsage.deployedUniqueIntegrationCount,
      });
    }
  }

  /* Write out a CSV file containing the customer usage data */
  const csvData = papaparse.unparse(usageData, { header: true });
  fs.writeFileSync(`./customer-usage-${year}.csv`, csvData);
};

main(year);
