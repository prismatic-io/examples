import { Button, Typography } from "@mui/material";
import prismatic from "@prismatic-io/marketplace";
import { useState } from "react";

// This file shows how you can load some data (in this case, integrations in marketplace)
// from Prismatic's API, and present them as ReactJS UI elements

const loadMarketplaceIntegrations = async (setResult) => {
  const query = `query getMarketplaceIntegrations {
    marketplaceIntegrations(
      sortBy: [{field: CATEGORY, direction: ASC}, {field: NAME, direction: ASC}]
    ) {
      nodes {
        id
        name
        avatarUrl
        description
        overview
        category
        marketplaceConfiguration
        isCustomerDeployable
        versionNumber
        versionSequence(first: 1, versionIsAvailable: true) {
          nodes {
            id
            versionNumber
          }
        }
        instances {
          nodes {
            id
            enabled
            lastDeployedAt
            configState
          }
        }
      }
    }
  }`;
  const result = await prismatic.graphqlRequest({ query });
  setResult(result);
};

function MarketplaceIntegrations() {
  const [result, setResult] = useState({});

  return (
    <>
      <Typography variant="body1">
        In this example, a list of available marketplace integrations is
        fetched, and the JSON response is printed below.
      </Typography>
      <Button
        onClick={() => loadMarketplaceIntegrations(setResult)}
        variant={"contained"}
      >
        Load Integrations...
      </Button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </>
  );
}

export default MarketplaceIntegrations;
