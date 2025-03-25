import component from ".";
import { oauth2Connection, OAuth2Type } from "@prismatic-io/spectral";
import {
  createConnection,
  createHarness,
} from "@prismatic-io/spectral/dist/testing";

/* Copied from Salesforce component for testing purposes */
const salesforceOAuth = oauth2Connection({
  oauth2Type: OAuth2Type.AuthorizationCode,
  key: "oauth2",
  display: {
    label: "Salesforce OAuth 2.0",
    description:
      "Authenticate requests to Salesforce using values obtained from the developer console.",
  },
  inputs: {
    authorizeUrl: {
      label: "Authorize URL",
      placeholder: "Authorize URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Authorization URL for Salesforce",
      default: "https://login.salesforce.com/services/oauth2/authorize",
    },
    tokenUrl: {
      label: "Token URL",
      placeholder: "Token URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Token URL for Salesforce",
      default: "https://login.salesforce.com/services/oauth2/token",
    },
    revokeUrl: {
      label: "Revoke URL",
      placeholder: "Revoke URL",
      type: "string",
      required: true,
      shown: true,
      comments: "The OAuth 2.0 Revocation URL for Salesforce",
      default: "https://login.salesforce.com/services/oauth2/revoke",
    },
    scopes: {
      label: "Scopes",
      placeholder: "Scopes",
      type: "string",
      required: false,
      shown: false,
      default: "",
      comments:
        "A space-delimited set of one or more scopes to get the user's permission to access.",
    },
    clientId: {
      label: "Consumer Key",
      placeholder: "Consumer Key",
      type: "string",
      required: true,
      shown: true,
    },
    clientSecret: {
      label: "Consumer Secret",
      placeholder: "Consumer Secret",
      type: "password",
      required: true,
      shown: true,
    },
  },
});

const harness = createHarness(component);
const sfConnection = createConnection(
  salesforceOAuth,
  {},
  {
    instance_url: process.env.SFDC_INSTANCE_URL, // Something like "https://prismatic3-dev-ed.my.salesforce.com"
    access_token: process.env.SFDC_ACCESS_TOKEN, // Something like "000000000000000000000000000000000000000000000_0000000000000000_0000000000000000000000000000000000000000000000000"
  }
);

test("Log out the JSON form that the data source generates", async () => {
  const { result } = await harness.dataSource("salesforceFieldMappingExample", {
    sfConnection,
  });
  console.log(JSON.stringify(result, null, 2));
});
