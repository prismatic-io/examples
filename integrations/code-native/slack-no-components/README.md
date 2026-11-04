# Slack Without Components

This code-native integration sends messages to Slack without using any existing Prismatic connectors. It defines its own OAuth 2.0 connection, HTTP client and channel-picker data source in TypeScript. It's one half of a pair. [Slack With Components](../slack-with-components/) has the same flows and configuration but builds them on Prismatic's Slack connector. Compare the two to decide which approach suits your integration.

## What this integration does

- **Send TODO messages to Slack**: Fetches TODO items from an "Acme" API (a placeholder JSON endpoint) and posts a Slack message for each incomplete item.
- **Send Slack Message on Account Received**: Receives an XML webhook payload, parses it with [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser), returns the payload's `challenge` value in the HTTP response, and posts a summary of the new account to Slack.

The configuration wizard has three pages:

1. **Connections**: Authenticate with Slack using OAuth 2.0
2. **Slack Config**: Select a channel from a dropdown of public channels
3. **Other Config**: Set the Acme API endpoint and a webhook endpoint that is called when an instance is deployed or deleted

## What it builds itself

| Need              | Implementation                                                                                                                              | File                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| OAuth connection  | `connectionConfigVar` with Slack's authorize, token and revoke URLs, scopes, client ID, client secret and signing secret                    | [src/connections.ts](src/connections.ts) |
| HTTP client       | Spectral's `createClient` with `https://slack.com/api` as the base URL and the OAuth access token as a bearer token                         | [src/slackClient.ts](src/slackClient.ts) |
| Channel dropdown  | `dataSourceConfigVar` that pages through `conversations.list` (up to 10 pages of 1,000), skips archived channels and sorts channels by name | [src/dataSources.ts](src/dataSources.ts) |
| Posting a message | A direct `POST` to `chat.postMessage` from each flow                                                                                        | [src/flows](src/flows)                   |

The connection's client ID, client secret and signing secret come from [src/slackConfig.ts](src/slackConfig.ts). Replace the `REPLACE_ME` values with your Slack app's credentials before you import.

## With or without components?

**Writing it yourself (this project)** gets you:

- Full control over the connection's inputs, scopes and how tokens are used.
- Access to any Slack endpoint and full control over requests, responses, pagination and error handling.
- No component dependency, so you don't need to generate or update component manifests.

**Using the connector** ([Slack With Components](../slack-with-components/)) gets you:

- OAuth 2.0 configured for you, with Slack's URLs as defaults.
- Prebuilt actions and data sources for Slack with typed inputs.
- Code that Prismatic maintains. When Slack's API changes, the component is updated and your integration code stays the same.
- Less code: no HTTP client, pagination loop or response handling to write.

Many integrations combine the two: they use a connector's connection and data sources, and make raw API calls where a prebuilt action doesn't fit. See [Using existing components in code-native integrations](https://prismatic.io/docs/integrations/code-native/existing-components/).

## Build, import and test

```bash
npm install
npm run build      # Bundle the integration into dist/
npm run import     # Build and import into Prismatic (requires the prism CLI)
npm test           # Run unit tests with Vitest
npm run lint       # Lint with Biome
npm run typecheck  # Type-check with tsc
```

After importing, open the integration in Prismatic, step through the configuration wizard and run each flow from the test runner. To test the webhook flow, POST an XML payload to the flow's webhook URL:

```bash
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/xml" \
  -d '<notification>
  <type>new_account</type>
  <challenge>TEST-123-456</challenge>
  <account>
    <first>Nelson</first>
    <last>Bighetti</last>
    <company><name>Hooli</name><city>Palo Alto</city><state>CA</state></company>
  </account>
</notification>'
```

The response body should be `TEST-123-456`, and a message should appear in the channel you selected.
