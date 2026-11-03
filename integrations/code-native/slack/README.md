# Slack

This integration demonstrates how to build Slack integrations that send notifications and alerts to channels. It showcases several integration patterns including customer-activated connections, dynamic channel selection with pagination, XML payload parsing, and custom webhook response handling.

## What this integration does

This integration provides two ways to send messages to Slack channels:

- **TODO Alerts**: On a user-configured schedule, fetches TODO items from an external system (referred to as "Acme" in this example) and sends notifications to Slack for incomplete tasks
- **Account Notifications**: Receives XML webhook payloads from external systems and posts formatted messages to Slack, with custom challenge-response handling

Both flows are configurable through a multi-step configuration wizard that allows customers to:

1. Authenticate with Slack using OAuth
2. Connect to their Acme API
3. Configure the schedule for TODO alerts
4. Select from a dropdown of available Slack channels

## Key features

### Customer-activated connections

This integration leverages [customer-activated connections](https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/) for Slack, which allow customers to **reuse existing Slack OAuth connections** across multiple integrations. This provides several benefits:

- Customers don't need to authenticate separately for each Slack integration
- Slack credentials are managed centrally
- Easier maintenance and credential rotation

The connection is configured in [configPages.ts](src/configPages.ts) using the `customerActivatedConnection` function with a stable key of `"slack-connection"`.

> Note: if you would like to import this integration yourself, you must create a customer-activated connection with a stable key of `slack-connection` using the Slack OAuth 2.0 component.

### Dynamic channel selection with pagination

Rather than hardcoding a Slack channel, users can select from **any** public channel in their workspace during configuration. The [configPages.ts](src/configPages.ts) data source queries the Slack API's `conversations.list` endpoint to populate a dropdown with available channels.

The implementation includes:

- **Pagination handling**: Loops through pages of channels using cursor-based pagination
- **Performance optimization**: Limits results to 10,000 channels (10 pages of 1,000) to prevent UI lag
- **Filtering**: Excludes archived channels and only shows public channels
- **Sorting**: Alphabetically sorts channels by name for easy selection

### XML payload parsing

The "Send Slack Message on Account Received" flow demonstrates how to handle XML webhook payloads. Using the [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) library, the flow:

1. Receives raw XML data from the webhook trigger
2. Parses the XML into a structured JavaScript object
3. Extracts relevant data fields from the parsed structure
4. Formats and sends the data to Slack

The XML parsing happens in the `onTrigger` function before the main execution, ensuring the payload is deserialized and ready for processing.

### Custom webhook response handling

The "Send Slack Message" flow includes a custom `onTrigger` function that demonstrates advanced webhook handling:

- **Challenge-response verification**: Extracts a challenge token from the XML payload and returns it in the HTTP response
- **Synchronous response**: Responds to the webhook caller immediately with a 200 status code before processing the message
- **Payload transformation**: Converts the raw XML body into a structured payload for use in `onExecution`

This pattern is useful when webhook sources require immediate acknowledgement before the integration completes its work.

### Direct Slack API usage

This integration interacts with the Slack API directly using HTTP requests rather than a pre-built component. The [slackClient.ts](src/slackClient.ts) creates an authenticated HTTP client using Spectral's `createClient` utility:

```typescript
createClient({
  baseUrl: "https://slack.com/api",
  headers: {
    Authorization: `Bearer ${connection.token?.access_token}`,
  },
});
```

This approach provides flexibility to use any Slack API endpoint and customize request/response handling.

## Integration structure

Beyond the standard integration files, this integration contains the following key files:

- [src/slackClient.ts](src/slackClient.ts) - Creates and exports an authenticated Slack API client using OAuth tokens
- [src/acmeClient.ts](src/acmeClient.ts) - Creates and exports an HTTP client for the Acme API using Spectral's HTTP client utilities
- [src/configPages.ts](src/configPages.ts) - Defines a multi-step configuration wizard with connection setup and dynamic channel selection
- [src/flows/todoAlerts.ts](src/flows/todoAlerts.ts) - Flow that fetches TODO items from Acme and sends alerts for incomplete tasks to Slack
- [src/flows/sendSlackMessages.ts](src/flows/sendSlackMessages.ts) - Flow that receives XML webhook payloads and posts formatted messages to Slack
- [src/componentRegistry.ts](src/componentRegistry.ts) - Component registry (currently empty, ready for custom components if needed)

## Flow details

### TODO Alerts Flow

The [todoAlerts.ts](src/flows/todoAlerts.ts) flow demonstrates a common integration pattern: fetching data from an API and sending notifications to Slack. This flow:

1. Triggers on a user-configured schedule (set during the configuration wizard)
2. Authenticates with the Acme API using connection config variables
3. Fetches a list of TODO items from the `/todos` endpoint
4. Iterates through each TODO item
5. For incomplete items, posts a message to the configured Slack channel
6. Logs progress and errors for monitoring

The schedule is configured using a `schedule` config variable in [configPages.ts](src/configPages.ts), allowing each customer to set their preferred frequency for TODO alerts.

This flow is similar to the ["Build Your First Integration" tutorial](https://prismatic.io/docs/getting-started/first-integration/build-first-integration/) in the Prismatic documentation, but implemented as code-native instead of low-code.

### Send Slack Messages Flow

The [sendSlackMessages.ts](src/flows/sendSlackMessages.ts) flow demonstrates webhook-triggered message posting with XML parsing. This flow:

1. Receives a webhook POST request with an XML body
2. Parses the XML payload using `fast-xml-parser`
3. Extracts a challenge token from the payload
4. Responds immediately with the challenge token (before processing)
5. Extracts account information from the parsed XML
6. Formats the data into a readable message
7. Posts the formatted message to the configured Slack channel

The expected XML payload format is:

```xml
<notification>
  <type>new_account</type>
  <challenge>067DEAB4-B89C-4211-9767-84C96A39CF8C</challenge>
  <account>
    <first>Nelson</first>
    <last>Bighetti</last>
    <company>
      <name>Hooli</name>
      <city>Palo Alto</city>
      <state>CA</state>
    </company>
  </account>
</notification>
```

## Testing the integration

You can test this integration in Prismatic.

### Prerequisites

1. **Slack Workspace**: You'll need access to a Slack workspace where you can create channels and post messages
2. **Customer-Activated Connection**: Create a customer-activated Slack connection in Prismatic with the stable key `slack-connection`. See [Customer-Activated Connections documentation](https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/) for setup instructions
3. **Acme API**: This example uses [JSONPlaceholder](https://jsonplaceholder.typicode.com) as a test endpoint, but you can replace it with your own API

### Running tests in Prismatic

To run the integration in Prismatic, first build and import the integration:

```bash
npm run build
prism integrations:import --open
```

Then:

1. Configure a test instance by following the configuration wizard
2. Authenticate with Slack using OAuth
3. Enter your Acme API connection details
4. Configure the schedule for TODO alerts (e.g., daily, hourly, etc.)
5. Select a Slack channel from the dropdown
6. Deploy the integration

Once deployed, you can test the flows:

**Testing the TODO Alerts flow:**

1. Trigger the flow manually or wait for the configured schedule to run
2. Check your configured Slack channel for messages about incomplete TODO items
3. Review execution logs to see which items were processed

**Testing the Send Slack Messages flow:**

1. Send a POST request to the webhook URL with an XML payload (example provided in the flow comments)
2. Verify you receive an immediate response containing the challenge token
3. Check your Slack channel for the formatted account notification message

### Testing the XML webhook locally

You can test the XML webhook handling using `curl`:

```bash
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0"?>
<notification>
  <type>new_account</type>
  <challenge>TEST-123-456</challenge>
  <account>
    <first>Nelson</first>
    <last>Bighetti</last>
    <company>
      <name>Hooli</name>
      <city>Palo Alto</city>
      <state>CA</state>
    </company>
  </account>
</notification>'
```

You should receive a response containing the challenge token `TEST-123-456`, and a message should appear in your Slack channel.

## Extending this integration

This integration provides a solid foundation that can be extended in several ways:

### Connecting to different systems

The "Acme" system in this example is a placeholder. To integrate with your own system:

1. Update [acmeClient.ts](src/acmeClient.ts) to authenticate with your API (OAuth, API keys, etc.)
2. Modify the API endpoint in [todoAlerts.ts](src/flows/todoAlerts.ts) to match your system's endpoint
3. Update the `TodoItem` interface to match your data structure
4. Adjust the message formatting logic to display your data

### Adding rich message formatting

Slack supports [rich message formatting](https://api.slack.com/messaging/composing) with blocks and attachments. To add formatted messages:

1. Replace the simple `text` parameter with a `blocks` array
2. Use Slack's [Block Kit](https://api.slack.com/block-kit) to create interactive messages
3. Add buttons, images, or other interactive elements
4. Consider using the [Block Kit Builder](https://app.slack.com/block-kit-builder) to design messages

Example:

```typescript
await slackClient.post("chat.postMessage", {
  channel: configVars["Select Slack Channel"],
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*New Account:* ${data.notification.account.first} ${data.notification.account.last}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Company:*\n${data.notification.account.company.name}`,
        },
        {
          type: "mrkdwn",
          text: `*Location:*\n${data.notification.account.company.city}, ${data.notification.account.company.state}`,
        },
      ],
    },
  ],
});
```

### Supporting JSON payloads

If your webhook source sends JSON instead of XML:

1. Remove the XML parsing logic from the `onTrigger` function
2. Access the parsed JSON directly from `payload.body.data`
3. Remove the `fast-xml-parser` dependency from `package.json`

Example:

```typescript
onTrigger: async (context, payload) => {
  // The payload body is already parsed as JSON by default
  const data = payload.body.data;

  return Promise.resolve({
    payload,
    response: {
      statusCode: 200,
      contentType: "application/json",
      body: { challenge: data.challenge },
    },
  });
},
```
