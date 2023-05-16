const { GraphQLClient } = require("graphql-request");
const {
  GET_INTEGRATION_VERSIONS,
  GET_INSTANCES,
  UPDATE_INSTANCE_VERSION,
  UPDATE_INSTANCE_API_KEY,
  DEPLOY_INSTANCE,
} = require("./queries");

const INTEGRATION_NAME = "Test Upgrading Instance API Key";
const NEW_API_KEY = "new-api-key";
const PRISMATIC_API_KEY = process.env.PRISMATIC_API_KEY;

if (!PRISMATIC_API_KEY) {
  throw new Error("You must set a PRISMATIC_API_KEY environment variable.");
}

const client = new GraphQLClient("https://app.prismatic.io/api", {
  headers: {
    Authorization: `Bearer ${PRISMATIC_API_KEY}`,
  },
});

const updateAllInstances = async () => {
  /** Get the ID of the most recently published version of the integration */
  const integrationVersions = await client.request(GET_INTEGRATION_VERSIONS, {
    integrationName: INTEGRATION_NAME,
  });
  const latestIntegrationVersion = integrationVersions.integrations.nodes[0];

  /** Get a list of enabled instances of the integration */
  const instances = await client.request(GET_INSTANCES, {
    integrationId: latestIntegrationVersion.id,
  });

  for (const instance of instances.instances.nodes) {
    console.log(
      `Updating instance ${instance.name} for ${instance.customer.name}...`
    );

    /** Update the instance's integration version */
    console.log("  ...updating integration version");
    await client.request(UPDATE_INSTANCE_VERSION, {
      instanceId: instance.id,
      integrationId: latestIntegrationVersion.id,
    });

    /** Update the instance's API key connection */
    console.log("  ...setting API key");
    await client.request(UPDATE_INSTANCE_API_KEY, {
      instanceId: instance.id,
      configVariables: [
        {
          key: "HTTP Connection",
          values: JSON.stringify([
            { name: "apiKey", type: "value", value: NEW_API_KEY },
          ]),
        },
      ],
    });

    /** Deploy the instance */
    console.log("  ...deploying instance");
    await client.request(DEPLOY_INSTANCE, { instanceId: instance.id });
  }
};

updateAllInstances();
