import { ArgumentParser } from "argparse";
import { GraphQLClient } from "graphql-request";
import { getErroredTestConnections } from "./getErroredTestConnections";
import { disconnectConnection } from "./disconnectConnection";

const parser = new ArgumentParser({
  description: "Disconnect test OAuth connections that are in error state.",
});

parser.add_argument("--apply", {
  help: "Disconnect errored connections",
  action: "store_true",
});
const args = parser.parse_args();

const API_ENDPOINT = process.env.PRISMATIC_URL
  ? `${process.env.PRISMATIC_URL}/api`
  : "https://app.prismatic.io/api";

const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;
if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}
const client = new GraphQLClient(API_ENDPOINT, {
  headers: { Authorization: `Bearer ${PRISMATIC_API_KEY}` },
});

async function main(apply = false) {
  for await (const erroredTestConnection of getErroredTestConnections(client)) {
    console.log(
      `Found "${erroredTestConnection.configVarName}" on integration "${erroredTestConnection.integrationName}" in error state.`
    );
    if (apply) {
      console.log(`\tdisconnecting ${erroredTestConnection.configVarId}...`);
      await disconnectConnection(client, erroredTestConnection.configVarId);
      console.log("\tdisconnected.");
    }
  }
}

main(args.apply);
