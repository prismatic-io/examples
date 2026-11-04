# Generic MCP Example

This integration demonstrates how to expose an integration's flow as an MCP (Model Context Protocol) tool to an AI agent. MCP is a protocol that enables AI agents to interact with external systems through well-defined tool interfaces. This example shows how to build integration flows that AI agents can discover, understand, and execute to retrieve data from external systems.

## What this integration does

This integration provides a single flow that AI agents can use as a tool:

- **Search People**: Search for people in Acme CRM by first name and/or last name

When an AI agent needs to find contact information, it can:

1. Discover the "search-people-in-acme" tool through MCP
1. Understand the tool's parameters (first name, last name) through the JSON schema
1. Invoke the tool with search criteria
1. Receive matching people records synchronously

## Key features

### Agent-compatible flows

The flow is configured as an agent flow using two key properties in [flows.ts](src/flows.ts):

- **`isAgentFlow: true`**: Makes the flow discoverable and callable by AI agents through MCP
- **`isSynchronous: true`**: Ensures the flow executes synchronously and returns results immediately, so the AI agent can use the response in its reasoning process

Without these flags, flows execute asynchronously and don't return data directly to the caller, making them unsuitable for AI agent tools.

### JSON Schema tool definition

The flow includes a JSON schema in the `schemas.invoke` property that describes the tool to the AI agent:

```typescript
schemas: {
  invoke: {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $comment: "Given a first and last name of a person, search for matching people in Acme CRM",
    properties: {
      first: {
        description: "A person's first name",
        type: "string",
      },
      last: {
        description: "A person's last name",
        type: "string",
      },
    },
    title: "search-people-in-acme",
    type: "object",
  },
}
```

This schema serves as the tool's interface definition:

- The **`title`** becomes the tool name that AI agents see
- The **`$comment`** explains the tool's purpose and usage
- The **`properties`** define the tool's parameters with descriptions
- The **`description`** fields help the AI agent understand what each parameter does

AI agents use this schema to determine when and how to use the tool, making clear, descriptive schemas critical for proper tool usage.

### Payload validation with Zod

The flow uses [Zod](https://zod.dev/) to validate and parse incoming parameters from the AI agent:

```typescript
const PeopleQuerySchema = zod.object({
  first: zod.string().optional(),
  last: zod.string().optional(),
});

const { first: firstNameSearch, last: lastNameSearch } =
  PeopleQuerySchema.parse(params.onTrigger.results.body.data);
```

This provides:

- **Type safety**: Ensures the parameters match expected types
- **Runtime validation**: Catches invalid data before processing
- **Clear error messages**: Helps debug issues when AI agents send incorrect parameters
- **Type inference**: TypeScript automatically infers types from the Zod schema

### Fuzzy search implementation

The flow implements a flexible search algorithm that matches records based on partial name matches:

```typescript
const matchingPeople = response.data.filter((person) => {
  const [firstName, lastName] = person.name.split(" ");
  if (firstNameSearch) {
    if (!firstName.toLowerCase().includes(firstNameSearch.toLowerCase())) {
      return false;
    }
  }
  if (lastNameSearch) {
    if (!lastName.toLowerCase().includes(lastNameSearch.toLowerCase())) {
      return false;
    }
  }
  return true;
});
```

This case-insensitive, partial matching approach makes the tool more flexible and user-friendly for AI agents that may not have exact name information.

## Testing the integration

You can test this integration both locally with unit tests and in Prismatic with an AI agent.

### Running unit tests

The integration includes unit tests in [flows.test.ts](src/flows.test.ts) that validate the search logic. Run tests with:

```bash
npm test
```

### Testing with an AI agent in Prismatic

To test the integration with an AI agent:

1. Build and import the integration:

```bash
npm run build
prism integrations:import --open
```

1. Configure an instance:
   - Set the **Acme Base URL** (defaults to `https://jsonplaceholder.typicode.com` for testing)
   - Enter any value for the **Acme API Key** (the mock API doesn't require authentication)
1. Deploy the instance to a customer
1. Configure an AI agent (like Claude or ChatGPT) with MCP access to your Prismatic instance
1. Ask the AI agent to search for people:
   - "Find people named Smith in Acme CRM"
   - "Search for someone with first name John"
   - "Look up Leanne in the CRM"

The AI agent will:

- Discover the `search-people-in-acme` tool through MCP
- Determine the appropriate parameters based on your request
- Call the tool with those parameters
- Receive the matching people records
- Present the results to you in natural language

### Testing the flow manually

You can also test the flow manually by sending a POST request to the flow's webhook URL:

```bash
curl -X POST https://your-instance-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "first": "Leanne",
    "last": "Graham"
  }'
```

You should receive a response containing matching people from the Acme CRM (in this case, the JSONPlaceholder mock API).

## Extending this integration

This integration provides a foundation that can be extended in several ways:

### Adding more agent tools

To add additional tools that AI agents can use:

1. Create new flows in [flows.ts](src/flows.ts) with `isAgentFlow: true` and `isSynchronous: true`
2. Define JSON schemas for each tool in the `schemas.invoke` property
3. Implement the tool logic in the `onExecution` function
4. Export the new flows from the flows array

Example tools you might add:

- Create a new person in the CRM
- Update an existing person's information
- Search for companies or opportunities
- Get detailed information about a specific person

### Connecting to a real CRM

The "Acme" system in this example is a mock API. To connect to a real CRM:

1. Update [client.ts](src/client.ts) to authenticate with your CRM's API (OAuth, API keys, etc.)
2. Update [configPages.ts](src/configPages.ts) to collect the necessary credentials
3. Modify the API endpoint in [flows.ts](src/flows.ts) to match your CRM's endpoint
4. Update the `AcmePeople` interface to match your CRM's data structure
5. Adjust the search and filtering logic to work with your CRM's API

### Improving search capabilities

To make the search more powerful:

1. **Add more search fields**: Extend the schema to support email, phone, or company searches
2. **Implement fuzzy matching**: Use a library like [fuzzball](https://www.npmjs.com/package/fuzzball) for more intelligent matching
3. **Add pagination**: For CRMs with large datasets, implement pagination to handle many results
4. **Support advanced queries**: Allow the AI agent to search using complex criteria (AND/OR logic)

Example of adding email search:

```typescript
schemas: {
  invoke: {
    properties: {
      first: { description: "A person's first name", type: "string" },
      last: { description: "A person's last name", type: "string" },
      email: { description: "A person's email address", type: "string" },
    },
    title: "search-people-in-acme",
    type: "object",
  },
}
```

## MCP and AI agent integrations

The Model Context Protocol (MCP) is a standardized protocol for connecting AI agents to external tools and data sources. When you mark a Prismatic flow as an agent flow:

1. Prismatic automatically exposes it through MCP
2. AI agents can discover the tool through the MCP protocol
3. The JSON schema you provide becomes the tool's interface definition
4. AI agents can call the tool and receive responses synchronously

This approach allows you to:

- **Extend AI agent capabilities**: Give agents access to private or specialized data sources
- **Maintain control**: Keep authentication and authorization logic in your integration
- **Reuse integrations**: Use existing Prismatic integrations as AI agent tools
- **Update independently**: Modify tool behavior without changing the AI agent configuration

For more information about building AI agent integrations in Prismatic, see the [Agent Flows documentation](https://prismatic.io/docs/ai/flow-invocation-schema/).
