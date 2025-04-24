import { ArgumentParser } from "argparse";
import { GraphQLClient } from "graphql-request";
import { getInstance } from "./getInstance";
import {
  deployInstance,
  updateInstanceConfiguration,
  updateInstanceIntegrationVersion,
} from "./updateInstance";

const parser = new ArgumentParser({
  description:
    "Update a Shopify instance to a version that supports templated connections.",
});

parser.add_argument("--instance-id", {
  help: "Instance ID",
  required: true,
});
parser.add_argument("--integration-version-id", {
  help: "ID of the integration version you'd like to upgrade to",
  required: true,
});
const args = parser.parse_args();

const API_ENDPOINT =
  process.env.PRISMATIC_URL || "https://app.prismatic.io/api";

const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient(API_ENDPOINT, {
  headers: { Authorization: `Bearer ${PRISMATIC_API_KEY}` },
});

interface MainParams {
  instanceId: string;
  integrationVersionId: string;
}
async function main({ instanceId, integrationVersionId }: MainParams) {
  // Get the specified shopify instance
  const instance = await getInstance(client, instanceId);
  if (instance.integration.id === integrationVersionId) {
    throw new Error(
      "This instance appears to already be on the specified version"
    );
  }

  // Get the current host's value
  const currentShopifyConnection = instance.configVariables.nodes.find(
    (cv) => cv.requiredConfigVariable.key === "Shopify Connection"
  );
  if (!currentShopifyConnection) {
    throw new Error("Config variable named 'Shopify Connection' not found.");
  }
  if (
    currentShopifyConnection.requiredConfigVariable.connection.key !== "oauth2"
  ) {
    throw new Error(
      "The 'Shopify Connection' config variable is not of the old OAuth connection type"
    );
  }
  const currentHostInput = currentShopifyConnection.inputs.nodes.find(
    (input) => input.name === "host"
  );
  if (!currentHostInput) {
    throw new Error(
      "Could not find an input 'host' on config variable 'Shopify Connection'"
    );
  }

  // Parse the subdomain
  const storeDomainRegex = /^([a-z0-9-]*)\.myshopify\.com$/;
  const domain = storeDomainRegex.exec(currentHostInput.value)?.[1];
  if (!domain) {
    throw new Error(
      `Could not regex a domain name from ${currentHostInput.value}`
    );
  }
  console.log(`Extracted base domain '${domain}' from current connection.`);

  // Update the instance's version and config variables
  console.log("Updating instance integration version...");
  await updateInstanceIntegrationVersion({
    client,
    instanceId,
    integrationVersionId,
  });
  console.log("   ✅ integration version updated.");
  console.log("Updating instance configuration...");
  await updateInstanceConfiguration({ client, instanceId, domain });
  console.log("   ✅ instance configuration updated.");
  console.log("Deploying instance...");
  await deployInstance({ client, instanceId });
  console.log("   ✅ instance deployed.");
}

main({
  instanceId: args.instance_id,
  integrationVersionId: args.integration_version_id,
});
