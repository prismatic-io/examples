# Dropbox Router Example

Some apps, like Dropbox, do not have customer-specific webhooks.
Instead, all events are sent to a single endpoint and these apps expect the receiving system to route the events to the correct customer or integration instance.

This example demonstrates how to implement such routing logic within a low-code integration using Prismatic.

See [Prismatic Documentation](https://prismatic.io/docs/integrations/triggers/single-endpoint-webhook-integrations/) for more details on handling single-endpoint webhooks.
