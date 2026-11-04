# Code-Native Integration Templates

Each directory here is a self-contained [code-native integration](https://prismatic.io/docs/integrations/code-native/) written in TypeScript with [Spectral](https://www.npmjs.com/package/@prismatic-io/spectral).
They are listed in [manifest.json](./manifest.json), and CI validates and builds every entry in that file.

| Template                                                        | Description                                                                                              |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **AI and MCP**                                                  |                                                                                                          |
| [generic-mcp-example](./generic-mcp-example/)                   | A minimal MCP tool that searches for people in an external CRM.                                          |
| [salesforce-mcp](./salesforce-mcp/)                             | A Salesforce MCP tool that searches contacts.                                                            |
| [gong-mcp-flows](./gong-mcp-flows/)                             | MCP tools that list Gong calls, search a user's calls and fetch transcripts.                             |
| [outlook-mcp-flows](./outlook-mcp-flows/)                       | MCP tools that search and send Outlook email and read and create calendar events.                        |
| **Data sync and triggers**                                      |                                                                                                          |
| [salesforce](./salesforce/)                                     | Field mapping and bidirectional sync with Salesforce, driven by Salesforce workflows.                    |
| [salesforce-initial-data-sync](./salesforce-initial-data-sync/) | Batch-sync a large Salesforce data set into PostgreSQL on deploy, then process new records in real time. |
| [simple-initial-data-sync](./simple-initial-data-sync/)         | Backfill from a paginated API on deploy using `batchFlowTrigger`, then process records via webhook.      |
| [postgres-polling-trigger](./postgres-polling-trigger/)         | Poll a PostgreSQL table for new rows with cursor-based state.                                            |
| [shared-endpoint-example](./shared-endpoint-example/)           | Route webhook requests through a shared endpoint.                                                        |
| **Large files**                                                 |                                                                                                          |
| [process-large-files](./process-large-files/)                   | Process large files with Node.js streams.                                                                |
| [large-file-transfer](./large-file-transfer/)                   | Copy a file of any size between Dropbox folders in chunks, one chunk per batch execution.                |
| **Slack**                                                       |                                                                                                          |
| [slack](./slack/)                                               | Send scheduled and webhook-driven Slack messages with dynamic channel selection.                         |
| [slack-with-components](./slack-with-components/)               | A Slack integration built on the existing Slack connector.                                               |
| [slack-no-components](./slack-no-components/)                   | The same Slack integration built without existing connectors, for comparison.                            |

## Working with a template

```bash
cd <template>
npm install
npm run build                # Bundle with tsdown into dist/
npm test                     # Run unit tests with vitest
npm run lint                 # Lint with Biome
prism integrations:import    # Build and import into Prismatic with Prism
```

The `import` script needs the [Prism CLI](https://prismatic.io/docs/cli/), and you must be logged in with `prism login`.

## Adding a template

1. Create a new directory containing `README.md`, `assets/icon.png` and a `package.json` with a `build` script.
2. Add an entry to [manifest.json](./manifest.json). It must conform to [manifest-schema.json](./manifest-schema.json).
