# Outlook MCP Flows

This integration exposes a user's Microsoft Outlook mailbox and calendar to AI agents as MCP (Model Context Protocol) tools. An AI agent connected to Prismatic's MCP server can read and search email, send messages, and check or create calendar events, so it can handle requests like "Do I have any unread email from Acme?" or "Book 30 minutes with sam@example.com tomorrow at 2pm with a Teams link".

## How the flows become MCP tools

Every flow in this integration is an [agent flow](https://prismatic.io/docs/ai/flow-invocation-schema/). Each one is defined with:

- **`isAgentFlow: true`**: Marks the flow as a tool that AI agents can discover
- **`isSynchronous: true`**: Returns the flow's result directly to the caller, so the agent can use it in its reasoning
- **A `description` and a JSON schema in `schemas.invoke`**: Tell the agent what the tool does and which parameters it accepts

Once an instance of this integration is deployed, Prismatic's [MCP server](https://prismatic.io/docs/ai/model-context-protocol/) lists these flows as tools for any AI agent (Claude, ChatGPT, Cursor, etc.) connected to it.

## Tools

| Flow (tool)           | Stable key              | What it does                                                                                           |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Check Inbox           | `check-inbox`           | Lists recent inbox messages, optionally only unread ones, with optional attachment details.            |
| Search Emails         | `search-emails`         | Searches email by keywords, sender, subject, attachments, read state and folder.                       |
| Send Email            | `send-email`            | Sends an email (plain text or HTML) to one or more recipients, with optional CC, BCC and importance.   |
| Check Calendar Events | `check-calendar-events` | Lists upcoming events for the next N days, optionally excluding all-day events.                        |
| Get Calendar Events   | `get-calendar-events`   | Lists events in a date range, with optional filters for recurring events and availability (free/busy). |
| Create Calendar Event | `create-calendar-event` | Creates an event with optional attendees, location, description, reminder and online meeting link.     |

The flows call [Microsoft Graph](https://learn.microsoft.com/en-us/graph/overview) with the [Microsoft Graph JavaScript client](https://github.com/microsoftgraph/msgraph-sdk-javascript). See [src/flows/](src/flows/) for the flow definitions and [src/services/graphClient.ts](src/services/graphClient.ts) for the client.

## Connection setup

The integration uses the Microsoft Outlook component's OAuth 2.0 connection, configured in [src/configPages.ts](src/configPages.ts). Customers sign in with Microsoft when they configure an instance. The connection requests these scopes: `User.Read`, `Calendars.ReadWrite`, `Mail.ReadWrite`, `Mail.Send` and `offline_access`.

The OAuth client ID and secret belong to your organization and are baked into the integration at build time:

1. In the [Azure portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade), register an app with a web redirect URI of `https://oauth2.prismatic.io/callback`, add the delegated Microsoft Graph permissions above, and create a client secret.
2. Copy `.env.example` to `.env` and fill in the app's credentials:

   ```bash
   MICROSOFT_CLIENT_ID=your_azure_app_client_id
   MICROSOFT_CLIENT_SECRET=your_azure_app_client_secret
   ```

`npm run build` inlines any `MICROSOFT_*` variables from `.env` into the bundle (see [tsdown.config.mts](tsdown.config.mts)). `.env` is gitignored.

## Building, importing and testing

```bash
npm install
npm run build      # Bundle the integration into dist/
npm run import     # Build and import the integration into Prismatic
npm test           # Run unit tests with Vitest
npm run lint       # Lint with Biome
npm run typecheck  # Type-check with tsc
```

After importing, deploy an instance to a test customer, then connect an AI agent to [Prismatic's MCP server](https://prismatic.io/docs/ai/model-context-protocol/) and ask it about your email or calendar. You can also call a flow directly by sending a POST request with a JSON body to the flow's webhook URL:

```bash
curl -X POST 'https://hooks.prismatic.io/trigger/YOUR_FLOW_WEBHOOK_ID' \
  -H "Content-Type: application/json" \
  -d '{ "unreadOnly": true, "limit": 10 }'
```
