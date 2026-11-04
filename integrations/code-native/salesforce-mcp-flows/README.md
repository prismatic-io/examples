# Salesforce MCP Flows

This integration exposes Salesforce opportunity data to AI agents as MCP (Model Context Protocol) tools. An AI agent connected to Prismatic's MCP server can look up a user's open pipeline and update opportunities in response to natural language requests like "Show me my deals closing this month over $50,000" or "Move the Acme opportunity to Negotiation and set the next step to 'Send contract'".

## How the flows become MCP tools

Every flow in this integration is an [agent flow](https://prismatic.io/docs/ai/flow-invocation-schema/). Each one is defined with:

- **`isAgentFlow: true`**: Marks the flow as a tool that AI agents can discover
- **`isSynchronous: true`**: Returns the flow's result directly to the caller, so the agent can use it in its reasoning
- **A `description` and a JSON schema in `schemas.invoke`**: Tell the agent what the tool does and which parameters it accepts

Once an instance of this integration is deployed, Prismatic's [MCP server](https://prismatic.io/docs/ai/model-context-protocol/) lists these flows as tools for any AI agent (Claude, ChatGPT, Cursor, etc.) connected to it.

## Tools

| Flow (tool)          | Stable key             | What it does                                                                                                                                                        |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Get My Opportunities | `get-my-opportunities` | Lists opportunities owned by the connected user, with optional filters for stage, minimum amount, close date range and result limit. Adds a computed `daysToClose`. |
| Update Opportunity   | `update-opportunity`   | Updates stage, next step, description, amount, close date or probability on an opportunity and returns the updated record.                                          |

The flows call Salesforce with [jsforce](https://jsforce.github.io/). See [src/flows/](src/flows/) for the flow definitions and [src/services/salesforceClient.ts](src/services/salesforceClient.ts) for the client.

> The `nextStepDate` parameter of Update Opportunity writes to a custom field, `NextStepDate__c`. Remove it from the flow if your org doesn't have that field.

## Connection setup

The integration uses the Salesforce component's OAuth 2.0 connection, configured in [src/configPages.ts](src/configPages.ts). Customers authenticate with Salesforce when they configure an instance. The OAuth client ID and secret belong to your organization and are baked into the integration at build time:

1. In Salesforce, create a Connected App (or External Client App) with OAuth enabled and a callback URL of `https://oauth2.prismatic.io/callback`.
2. Copy `.env.example` to `.env` and fill in the app's consumer key and secret:

   ```bash
   SALESFORCE_CLIENT_ID=your_salesforce_consumer_key
   SALESFORCE_CLIENT_SECRET=your_salesforce_consumer_secret
   ```

`npm run build` inlines any `SALESFORCE_*` variables from `.env` into the bundle (see [tsdown.config.mts](tsdown.config.mts)). `.env` is gitignored.

## Building, importing and testing

```bash
npm install
npm run build      # Bundle the integration into dist/
npm run import     # Build and import the integration into Prismatic
npm test           # Run unit tests with Vitest
npm run lint       # Lint with Biome
npm run typecheck  # Type-check with tsc
```

After importing, deploy an instance to a test customer, then connect an AI agent to [Prismatic's MCP server](https://prismatic.io/docs/ai/model-context-protocol/) and ask it about your opportunities. You can also call a flow directly by sending a POST request with a JSON body to the flow's webhook URL:

```bash
curl -X POST 'https://hooks.prismatic.io/trigger/YOUR_FLOW_WEBHOOK_ID' \
  -H "Content-Type: application/json" \
  -d '{ "stage": "Prospecting", "minAmount": 50000, "limit": 10 }'
```
