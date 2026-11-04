# Salesforce MCP Example

This integration demonstrates how to present data from a third-party application (Salesforce) to an AI agent through MCP (Model Context Protocol) tools. By exposing Salesforce data and operations as MCP tools, AI agents can access, query, and update Salesforce records directly, enabling natural language interactions with your CRM data.

## What this integration does

This integration provides two flows that AI agents can use as tools to interact with Salesforce opportunities:

- **Get My Opportunities**: Retrieve opportunities owned by the current user with optional filtering by stage, amount, close date range, and result limits
- **Update Opportunity**: Update specific fields on an opportunity (stage, next step, description, amount, close date, probability)

When an AI agent needs to work with Salesforce data, it can:

1. Discover available Salesforce tools through MCP
2. Understand each tool's parameters through JSON schemas
3. Invoke tools with appropriate parameters based on user requests
4. Receive Salesforce data synchronously and use it in reasoning
5. Update Salesforce records based on user instructions

For example, a user might ask: "Show me my opportunities closing this quarter with amounts over $50,000" or "Update the next step on the Acme Corp opportunity to 'Schedule demo'". The AI agent would use these MCP tools to fulfill those requests.

## Key features

### Agent-compatible flows

Both flows are configured as agent flows using three critical properties:

- **`isAgentFlow: true`**: Explicitly marks the flow as an agent flow, making it discoverable through MCP
- **`isSynchronous: true`**: Ensures flows execute synchronously and return results immediately, allowing AI agents to use responses in their reasoning
- **JSON Schema in `schemas.invoke`**: Defines the tool interface that AI agents use to understand parameters and usage

Without these properties, flows would either not be discoverable by AI agents or would run asynchronously without returning data directly to the caller, making them unsuitable as AI agent tools.

### JSON Schema tool definitions

Each flow includes a JSON schema that describes the tool to AI agents:

**Get My Opportunities schema:**

```typescript
schemas: {
  invoke: {
    properties: {
      stage: {
        type: "string",
        description: "Filter by stage name (optional)",
      },
      minAmount: {
        type: "number",
        description: "Minimum opportunity amount (optional)",
      },
      closeDateFrom: {
        type: "string",
        description: "Start date for close date range filter (YYYY-MM-DD format, optional)",
      },
      closeDateTo: {
        type: "string",
        description: "End date for close date range filter (YYYY-MM-DD format, optional)",
      },
      limit: {
        type: "number",
        description: "Maximum number of opportunities to return (default: 50)",
        default: 50,
      },
    },
  },
}
```

These schemas serve as the interface between the AI agent and your Salesforce data:

- **Properties** define available parameters with types and descriptions
- **Descriptions** help AI agents understand when and how to use each parameter
- **Optional fields** give AI agents flexibility in how they query data

Clear, descriptive schemas are critical for AI agents to use tools correctly.

### Salesforce integration with jsforce

This integration uses [jsforce](https://jsforce.github.io/), a comprehensive JavaScript library for Salesforce APIs. jsforce provides:

- OAuth 2.0 authentication with access and refresh tokens
- CRUD operations on Salesforce records
- SOQL query execution
- Metadata API access
- Type-safe TypeScript interfaces

The Salesforce client is created in [services/salesforceClient.ts](src/services/salesforceClient.ts) using OAuth tokens from the customer-activated connection:

```typescript
new jsforce.Connection({
  instanceUrl: connection.token.instance_url,
  accessToken: connection.token.access_token,
  version: "61.0",
});
```

### Customer-activated connections

This integration leverages [customer-activated connections](https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/), allowing customers to reuse existing Salesforce OAuth connections across multiple integrations. Benefits include:

- No separate authentication required for each integration
- Centrally managed Salesforce credentials
- Easier credential rotation and maintenance
- Consistent authentication across all Salesforce integrations

The connection is configured in [configPages.ts](src/configPages.ts) using a stable key of `"salesforce-cac"`.

> Note: To import this integration, you must create a customer-activated connection with the stable key `salesforce-cac` using the Salesforce OAuth 2.0 component.

### Intelligent data transformation

The flows transform raw Salesforce data into AI-friendly formats. For example, [getMyOpportunities.ts](src/flows/getMyOpportunities.ts) adds computed fields like `daysToClose`:

```typescript
daysToClose: opp.CloseDate
  ? Math.ceil(
      (new Date(opp.CloseDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    )
  : null,
```

This helps AI agents better understand and communicate urgency, like "You have 3 opportunities closing in the next 7 days."

### Dynamic SOQL query building

The Get My Opportunities flow dynamically builds SOQL queries based on input parameters, allowing flexible filtering:

```typescript
let query = `
  SELECT Id, Name, Account.Name, Amount, StageName, CloseDate, ...
  FROM Opportunity
  WHERE OwnerId = '${userId}'
`;

if (input?.stage) {
  query += ` AND StageName = '${input.stage}'`;
}

if (input?.minAmount) {
  query += ` AND Amount >= ${input.minAmount}`;
}
```

This enables AI agents to construct complex queries based on natural language requests.

## Integration structure

This integration contains the following key files:

- [src/services/salesforceClient.ts](src/services/salesforceClient.ts) - Creates a jsforce connection using OAuth tokens from customer-activated connections
- [src/flows/getMyOpportunities.ts](src/flows/getMyOpportunities.ts) - Flow that queries opportunities owned by the current user with optional filters
- [src/flows/updateOpportunity.ts](src/flows/updateOpportunity.ts) - Flow that updates specific fields on an opportunity and returns the updated record
- [src/configPages.ts](src/configPages.ts) - Configuration wizard for setting up the Salesforce customer-activated connection
- [src/types/salesforce.ts](src/types/salesforce.ts) - TypeScript interfaces for Salesforce API responses
- [src/types/flows.ts](src/types/flows.ts) - TypeScript interfaces for flow inputs and outputs
- [src/index.ts](src/index.ts) - Integration definition and metadata

## Testing the integration

### Prerequisites

1. **Salesforce Developer Account**: Sign up for a free [Salesforce Developer Edition](https://developer.salesforce.com/signup) if you don't have one
2. **Customer-Activated Connection**: Create a customer-activated Salesforce connection in Prismatic with the stable key `salesforce-cac`. See [Customer-Activated Connections documentation](https://prismatic.io/docs/integrations/connections/integration-agnostic-connections/customer-activated/) for setup instructions
3. **Test Data**: Ensure your Salesforce org has some Opportunity records for testing

### Testing with an AI agent in Prismatic

To test the integration with an AI agent:

1. Build and import the integration:

   ```bash
   npm run build
   prism integrations:import --open
   ```

2. Configure an instance:
   - Select your Salesforce customer-activated connection
3. Deploy the instance to a customer
4. Configure an AI agent (like Claude or ChatGPT) with MCP access to your Prismatic instance
5. Ask the AI agent questions about your opportunities:
   - "Show me my opportunities closing this month"
   - "What are my top 3 opportunities by amount?"
   - "Update the ABC Corp opportunity to Closed Won stage"
   - "Set the next step for opportunity ID 006... to 'Schedule follow-up call'"

The AI agent will:

- Discover the `get-my-opportunities` and `update-opportunity` tools through MCP
- Determine appropriate parameters based on your requests
- Call the tools with those parameters
- Receive Salesforce data and present it in natural language
- Confirm updates and show the updated record details

### Testing flows manually

You can also test flows manually by sending POST requests to their webhook URLs:

**Get My Opportunities:**

```bash
curl -X POST https://your-instance-webhook-url/get-my-opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "Prospecting",
    "minAmount": 50000,
    "limit": 10
  }'
```

**Update Opportunity:**

```bash
curl -X POST https://your-instance-webhook-url/update-opportunity \
  -H "Content-Type: application/json" \
  -d '{
    "opportunityId": "006...",
    "stageName": "Proposal/Price Quote",
    "nextStep": "Schedule demo"
  }'
```

## Extending this integration

This integration provides a foundation that can be extended in several ways:

### Adding more Salesforce tools

To expose additional Salesforce capabilities to AI agents:

1. Create new flows with `isAgentFlow: true` and `isSynchronous: true`
2. Define JSON schemas in the `schemas.invoke` property
3. Implement the logic using jsforce operations
4. Export the flows from [flows/index.ts](src/flows/index.ts)

Example tools you might add:

- Get account details and related opportunities
- Search for opportunities by account name or keywords
- Create new opportunities
- List available opportunity stages
- Get opportunity history and activity timeline
- Query contacts associated with opportunities
- Retrieve sales forecasts

### Supporting other Salesforce objects

The pattern used for opportunities can be applied to any Salesforce object:

1. Copy and modify flow files to query different objects (Lead, Contact, Case, etc.)
2. Update TypeScript interfaces in `src/types/salesforce.ts`
3. Adjust SOQL queries and field mappings
4. Update JSON schemas to reflect object-specific fields

Example for Cases:

```typescript
export const getMyCases = flow({
  name: "Get My Cases",
  stableKey: "get-my-cases",
  isAgentFlow: true,
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        status: { type: "string", description: "Filter by case status" },
        priority: { type: "string", description: "Filter by priority" },
      },
    },
  },
  onExecution: async (context, params) => {
    // Query cases owned by current user
  },
});
```

### Enhanced filtering and search

Improve query capabilities by adding:

1. **Full-text search**: Use SOSL for searching across multiple fields
2. **Date range helpers**: Support relative dates like "this quarter", "next month"
3. **Multiple filters**: Allow combining filters with AND/OR logic
4. **Custom field support**: Query custom fields specific to your Salesforce org
5. **Relationship queries**: Include related objects like Contacts, Tasks, Events

### Adding write operations

Expand beyond updates to include create and delete operations:

```typescript
export const createOpportunity = flow({
  name: "Create Opportunity",
  stableKey: "create-opportunity",
  isAgentFlow: true,
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        name: { type: "string", description: "Opportunity name" },
        accountId: { type: "string", description: "Related account ID" },
        closeDate: { type: "string", description: "Expected close date" },
        stage: { type: "string", description: "Initial stage" },
        amount: { type: "number", description: "Opportunity amount" },
      },
      required: ["name", "accountId", "closeDate", "stage"],
    },
  },
  onExecution: async (context, params) => {
    const conn = createSalesforceConnection(
      context.configVars["Salesforce Connection"]
    );
    const result = await conn.sobject("Opportunity").create({
      Name: params.onTrigger.results.body.data.name,
      AccountId: params.onTrigger.results.body.data.accountId,
      CloseDate: params.onTrigger.results.body.data.closeDate,
      StageName: params.onTrigger.results.body.data.stage,
      Amount: params.onTrigger.results.body.data.amount,
    });
    return { data: { success: true, id: result.id } };
  },
});
```

### Implementing bulk operations

For scenarios requiring processing multiple records:

1. Use jsforce's bulk API for high-volume operations
2. Add batch processing capabilities to flows
3. Implement pagination for large result sets
4. Add progress tracking for long-running operations

### Adding validation and error handling

Enhance production readiness with:

1. **Input validation with Zod**: Validate parameters before querying Salesforce
2. **Field validation**: Verify field names exist before queries
3. **Permission checks**: Handle insufficient permissions gracefully
4. **Rate limit handling**: Implement retry logic for API limits
5. **Detailed error messages**: Provide actionable feedback to AI agents

Example with Zod:

```typescript
import { z } from "zod";

const GetOpportunitiesSchema = z.object({
  stage: z.string().optional(),
  minAmount: z.number().positive().optional(),
  closeDateFrom: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  closeDateTo: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  limit: z.number().int().min(1).max(200).default(50),
});

// In onExecution:
const input = GetOpportunitiesSchema.parse(params.onTrigger.results.body.data);
```

### Connecting to other CRMs

The MCP pattern demonstrated here works with any CRM or third-party system:

1. Replace jsforce with your CRM's SDK or API client
2. Update authentication in [configPages.ts](src/configPages.ts)
3. Modify data types to match your CRM's schema
4. Adjust query and update logic for your CRM's API

This integration serves as a template for exposing any third-party application's data to AI agents through MCP.

## MCP and AI agent integrations

The Model Context Protocol (MCP) provides a standardized way for AI agents to interact with external systems. When you create synchronous flows with JSON schemas in Prismatic:

1. Prismatic automatically exposes flows through MCP
2. AI agents discover tools through the MCP protocol
3. JSON schemas define tool interfaces and parameters
4. AI agents call tools and receive responses synchronously
5. Responses are used in the agent's reasoning and replies

This approach enables:

- **Extending AI agent capabilities**: Give agents access to private data sources like Salesforce
- **Maintaining control**: Keep authentication and authorization in your integration
- **Reusing integrations**: Leverage existing Prismatic integrations as AI tools
- **Independent updates**: Modify tool behavior without changing AI agent configuration
- **Natural language interfaces**: Let users interact with systems conversationally

For more information about building AI agent integrations in Prismatic, see the [Agent Flows documentation](https://prismatic.io/docs/ai/flow-invocation-schema/).
