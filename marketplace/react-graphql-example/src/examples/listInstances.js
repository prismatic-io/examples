import { Button, Typography } from "@mui/material";
import prismatic from "@prismatic-io/marketplace";
import { useState } from "react";

// This file shows how you can load your customer's existing instances and display
// each one's webhook URLs

const loadInstances = async (setInstances) => {
  const query = `{
    authenticatedUser {
      customer {
        instances {
          nodes {
            id
            name
            flowConfigs {
              nodes {
                id
                flow {
                  name
                }
                apiKeys
                webhookUrl
              }
            }
          }
        }
      }
    }
  }`;
  const result = await prismatic.graphqlRequest({ query });
  setInstances(result.data.authenticatedUser.customer.instances.nodes);
};

function ListInstances() {
  const [instances, setInstances] = useState([]);

  return (
    <>
      <Typography variant="body1">
        In this example, all instances that are currently deployed to the
        current user's customer are listed, along with each instance's webhook
        URLs.
      </Typography>
      <Button onClick={() => loadInstances(setInstances)} variant={"contained"}>
        Load Instances...
      </Button>
      <ul>
        {instances.map((instance) => (
          <li key={instance.id}>
            {instance.name} (<em>{instance.id}</em>)
            <ul>
              {instance.flowConfigs.nodes.map((flowConfig) => (
                <li key={flowConfig.id}>
                  {flowConfig.flow.name} -{" "}
                  <a href={flowConfig.webhookUrl}>{flowConfig.webhookUrl}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListInstances;
