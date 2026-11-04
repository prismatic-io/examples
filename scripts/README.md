# Scripts

This directory contains standalone scripts and small apps that interact with Prismatic's [GraphQL API](https://prismatic.io/docs/api/) or receive events from Prismatic.
Use them as a starting point for automating your Prismatic tenant.

| Script                                                                    | Description                                                                                                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [backup-integrations-and-instances](./backup-integrations-and-instances/) | Back up all integrations and their deployed instances to disk, and restore them later.                                                |
| [create-alert-monitors](./create-alert-monitors/)                         | Idempotently add alert monitors to your instances.                                                                                    |
| [handle-event-webhooks](./handle-event-webhooks/)                         | A web app that receives Prismatic [event webhooks](https://prismatic.io/docs/webhooks/) and tracks flow webhook URLs in SQLite.       |
| [integration-workflow-migration](./integration-workflow-migration/)       | Convert integration YAML into individual workflow YAML files when moving from the embedded designer to the embedded workflow builder. |
| [query-customer-usage](./query-customer-usage/)                           | Report instance counts and compute usage per customer, useful for usage-based billing.                                                |
| [replay-failed-executions](./replay-failed-executions/)                   | Find and replay failed executions for an instance.                                                                                    |

Most scripts authenticate with a Prismatic API token. You can generate one with `prism me:token`.
See each script's README for setup instructions.
