import { Button, Typography } from "@mui/material";
import prismatic from "@prismatic-io/marketplace";
import { useState } from "react";

const getDropboxVersionId = async () => {
  const query = `query getMarketplaceIntegrations($name: String) {
    marketplaceIntegrations(
      name: $name
      sortBy: [{field: CATEGORY, direction: ASC}, {field: NAME, direction: ASC}]
    ) {
      nodes {
        id
        name
        versionSequence(first: 1, versionIsAvailable: true) {
          nodes {
            id
            versionNumber
          }
        }
      }
    }
  }`;
  const variables = { name: "Dropbox" };

  const result = await prismatic.graphqlRequest({ query, variables });
  return result.data.marketplaceIntegrations.nodes[0].versionSequence.nodes[0]
    .id;
};

const getCustomerId = async () => {
  const query = `{
    authenticatedUser {
      customer {
        id
      }
    }
  }`;
  const result = await prismatic.graphqlRequest({ query });
  return result.data.authenticatedUser.customer.id;
};

const createInstance = async ({
  dropboxVersionId,
  customerId,
  instanceName,
}) => {
  const query = `mutation createDropboxInstance($customerId: ID!, $integrationId: ID!, $instanceName: String!) {
    createInstance(input: {customer: $customerId, integration: $integrationId, name: $instanceName}){
      instance {
        id
        name
        configVariables {
          nodes {
            authorizeUrl
          }
        }
        flowConfigs {
          nodes {
            id
            flow {
              name
            }
            webhookUrl
          }
        }
      }
    }
  }`;
  const variables = {
    customerId,
    integrationId: dropboxVersionId,
    instanceName,
  };
  const result = await prismatic.graphqlRequest({ query, variables });
  return result;
};

const deployInstance = async ({ instanceId }) => {
  const query = `mutation deployDropbox($instanceId: ID!){
    deployInstance(input:{id:$instanceId}) {
      instance {
        lastDeployedAt
      }
    }
  }`;
  const variables = { instanceId };
  await prismatic.graphqlRequest({ query, variables });
};

function DeployDropbox() {
  const [instance, setInstance] = useState({});
  return (
    <>
      <Typography variant="body1">
        In this example, an instance of an integration named Dropbox is created,
        the user is redirected to an OAuth screen, and the instance is then
        deployed. <br />
        Note: this assumes that you have an integration in your marketplace
        called "Dropbox", and that the integration has only one config variable
        - the Dropbox connection.
      </Typography>
      <Button
        onClick={async () => {
          const customerId = await getCustomerId();
          const dropboxVersionId = await getDropboxVersionId();
          const dropboxInstance = await createInstance({
            dropboxVersionId,
            customerId,
            instanceName: `Dropbox ${Math.floor(new Date())}`,
          });
          const oauthEndpoint =
            dropboxInstance.data.createInstance.instance.configVariables
              .nodes[0].authorizeUrl;
          window.open(oauthEndpoint, "", "width=800, height=800");
          setInstance(dropboxInstance);
        }}
        variant={"contained"}
      >
        Create Instance
      </Button>
      <Button
        variant={"outlined"}
        onClick={async () => {
          const instanceId = instance.data.createInstance.instance.id;
          await deployInstance({ instanceId });
        }}
      >
        Deploy Instance
      </Button>
      <pre>{JSON.stringify(instance, null, 2)}</pre>
    </>
  );
}

export default DeployDropbox;
