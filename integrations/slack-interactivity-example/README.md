# Prismatic Example Integration: Slack Interactive Post Template

This repository contains an example integration for Prismatic that consists of two parts: the main Slack integration called "Slack Interactive Post Template" and a Slack Webhook Router integration.

## Slack Interactive Post Template

The Slack Interactive Post Template integration has three main flows:

1. **Send Message Flow**: This flow triggers on a webhook, creating an endpoint that you can make POST requests to with a payload containing the JSON for a Slack block message. The message will be posted to the channel selected in the configuration wizard.

2. **Instance Deploy Flow**: This flow fires on instance deploy and registers itself with the Slack Interactivity Router integration.

3. **Handle Button Responses Flow**: This flow handles webhook requests, forwarded from the router, that fire when a user interacts with the message.

## Slack Interactivity Router

The Slack Interactivity Router takes the webhook notifications from your Slack app when someone interacts with a post that the bot posts. The reason we need a router integration is because Slack uses a single endpoint strategy for Slack bot notifications for interactivity, so every interactivity goes to one webhook. We have documentation about single endpoint webhook integrations here: [https://prismatic.io/docs/quickstarts/single-endpoint-webhook-integrations/](https://prismatic.io/docs/quickstarts/single-endpoint-webhook-integrations/)

You'll deploy the Slack router to a "system" customer, but the Slack Interactive Post Template can be deployed to multiple customers.

This integration has 2 main flows:

1. **Registration Endpoint**: The other integration will call this flow on instance deploy and register itself with a channel ID and webhook URL for forwarding events to.
2. **Route Request**: When a Slack interaction is received, this flow will looks up the webhook URL that was registered with the channel ID and forwards Slack's payload to the appropriate instance of the Slack Interactive Post Template integration.