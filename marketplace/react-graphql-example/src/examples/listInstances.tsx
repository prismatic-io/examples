import { Button, Typography } from "@mui/material";
import prismatic from "@prismatic-io/embedded";
import { useState } from "react";

// This file shows how you can load your customer's existing instances and display
// each one's webhook URLs

const loadInstances = async (setInstances: Function) => {
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

interface FlowConfig {
  id: string;
  flow: { name: string };
  webhookUrl: string;
}

interface Instance {
  id: string;
  name: string;
  flowConfigs: {
    nodes: FlowConfig[];
  };
}

function ListInstances() {
  const [instances, setInstances] = useState<Instance[]>([]);

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
