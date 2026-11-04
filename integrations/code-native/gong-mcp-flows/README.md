# Gong MCP Flows

This integration exposes Gong call recordings and transcripts to AI agents as MCP (Model Context Protocol) tools. An AI agent connected to Prismatic's MCP server can find calls and read what was said on them, so it can answer questions like "What did the customer say about pricing on my calls last week?" or "Summarize Jane's discovery calls this month".

## How the flows become MCP tools

Every flow in this integration is an [agent flow](https://prismatic.io/docs/ai/flow-invocation-schema/). Each one is defined with:

- **`isAgentFlow: true`**: Marks the flow as a tool that AI agents can discover
- **`isSynchronous: true`**: Returns the flow's result directly to the caller, so the agent can use it in its reasoning
- **A `description` and a JSON schema in `schemas.invoke`**: Tell the agent what the tool does and which parameters it accepts

Once an instance of this integration is deployed, Prismatic's [MCP server](https://prismatic.io/docs/ai/model-context-protocol/) lists these flows as tools for any AI agent (Claude, ChatGPT, Cursor, etc.) connected to it.

## Tools

| Flow (tool)          | Stable key          | What it does                                                                                                                                                       |
| -------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| List Calls           | `list-calls`        | Lists calls in a date range (defaults to the last 7 days), up to an optional limit.                                                                                |
| Get Call Transcripts | `get-transcripts`   | Fetches full transcripts for 1 to 100 call IDs.                                                                                                                    |
| Search User Calls    | `search-user-calls` | Finds a Gong user by email and lists their calls in a date range (defaults to the last 30 days), with participants and, optionally, a transcript snippet per call. |

The flows call the [Gong API](https://gong.app.gong.io/settings/api/documentation) with [axios](https://axios-http.com/). See [src/flows/](src/flows/) for the flow definitions and [src/services/gongApi.ts](src/services/gongApi.ts) for the API helpers.

## Connection setup

The integration uses a connection with two fields, defined in [src/configPages.ts](src/configPages.ts). Customers enter them when they configure an instance:

- **Access Key**
- **Secret Key**

A Gong technical administrator can generate this key pair in Gong under **Company Settings > Ecosystem > API**. The integration sends them to Gong as HTTP basic auth.

### Environment variables

The same credentials are used by the live API tests in [src/index.test.ts](src/index.test.ts). Copy `.env.example` to `.env` and fill it in to run them:

```bash
GONG_API_ACCESS_KEY=your_access_key
GONG_API_SECRET_KEY=your_secret_key
# Optional: a Gong user's email, used by the "search user calls" test
GONG_TEST_USER_EMAIL=someone@example.com
```

Without these variables, the tests are skipped. `.env` is gitignored.

## Building, importing and testing

```bash
npm install
npm run build      # Bundle the integration into dist/
npm run import     # Build and import the integration into Prismatic
npm test           # Run tests with Vitest (live tests run only if credentials are set)
npm run lint       # Lint with Biome
npm run typecheck  # Type-check with tsc
```

After importing, deploy an instance to a test customer, then connect an AI agent to [Prismatic's MCP server](https://prismatic.io/docs/ai/model-context-protocol/) and ask it about your calls. You can also call a flow directly by sending a POST request with a JSON body to the flow's webhook URL:

```bash
curl -X POST 'https://hooks.prismatic.io/trigger/YOUR_FLOW_WEBHOOK_ID' \
  -H "Content-Type: application/json" \
  -d '{ "userEmail": "someone@example.com", "includeTranscripts": true }'
```
