const { GraphQLClient } = require("graphql-request");
const {
  GET_INSTANCES,
  DISABLE_INSTANCE,
  DELETE_INSTANCE,
} = require("./queries");

const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;

if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}

const identifier = process.env.IDENTIFIER;
const action = process.env.ACTION;

const API_ENDPOINT = process.env.PRISMATIC_URL
  ? `${process.env.PRISMATIC_URL}/api`
  : "https://app.prismatic.io/api";

const client = new GraphQLClient(API_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${PRISMATIC_API_KEY}`,
  },
});

async function manageInstances(identifier, action) {
  try {
    /** Get a list of all enabled instances */
    const instancesList = await client.request(GET_INSTANCES);

    const instances = instancesList.instances.nodes;

    /** Loop through all nodes and find the instance Id or name that matches the identifier */
    const instance = instances.find(
      (i) => i.id === identifier || i.name === identifier
    );
    if (!instance) {
      console.log(`No instance found with ID or name "${identifier}".`);
      return;
    }

    /** Disable or Delete the found instance depending on the action */
    if (action === "disable") {
      const res = await client.request(DISABLE_INSTANCE, { id: instance.id });
      console.log(`Disabled: ${res.updateInstance.instance.name}`);
    } else if (action === "delete") {
      const res = await client.request(DELETE_INSTANCE, { id: instance.id });
      console.log(`🗑️ Deleted: ${res.deleteInstance.instance.name}`);
    } else {
      console.log('Unknown action. Use "disable" or "delete".');
    }
  } catch (err) {
    console.error("GraphQL error:", err.message);
  }
}

manageInstances(identifier, action.toLowerCase());
