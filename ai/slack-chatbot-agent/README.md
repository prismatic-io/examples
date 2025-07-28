# Slack AI Assistant Example for Prismatic

A starter example for building AI-powered Slack apps using Slack's Assistant framework and OpenAI agents on Prismatic's Code-Native Integration platform. This example demonstrates how to create intelligent Slack apps with conversational AI and web search capabilities.

## Overview

This example demonstrates how to build Slack apps that leverage Slack's new AI Assistant capabilities. It provides a foundation that B2B software companies can build upon to create AI-powered Slack experiences for their customers.

The example showcases:

- Integration with Slack's Assistant framework for dedicated AI interactions
- OpenAI Agent SDK for intelligent conversation handling
- Web search capabilities through Tavily API
- Thread-based conversation context management
- Suggested prompts for better user engagement

## Key Features

- OpenAI Agent SDK integration with `@openai/agents`
- Web search through Tavily API
- Thread-based conversation context
- Customizable system prompts
- Slack Assistant framework integration
- Suggested prompts for user guidance
- Dynamic integration discovery - automatically exposes customer's Prismatic integrations as AI tools
- Embedded user authentication for secure multi-tenant operations
- Seamless invocation of customer-specific workflows

## Prismatic Integration Tools

This example includes support for dynamically discovering and invoking Prismatic integrations as AI agent tools. When configured with a Prismatic signing key, the AI assistant can:

- Automatically discover all enabled integrations for a specific customer
- Convert integration flows into callable tools with proper parameter schemas
- Invoke customer-specific workflows directly from the AI conversation
- Maintain secure, multi-tenant isolation using embedded user authentication

This capability allows B2B companies to create AI assistants that can interact with customer-specific integrations, providing a personalized experience where the AI can trigger workflows, query data, and perform actions unique to each customer's configuration.

## Architecture

The integration uses a webhook-based flow:

1. Slack sends events to Prismatic webhook endpoint
2. Flow acknowledges receipt immediately (Slack 3s requirement)
3. (Optional) If configured, discover customer's Prismatic integrations as tools
4. OpenAI agent processes message with conversation context
5. Agent may invoke web search or customer-specific integration tools
6. Response sent back through Slack Assistant API

### Implementation Flow

```typescript
// Webhook receives Slack event
const slackEvent = params.onTrigger.results.body.data;

// Create agent with web search tool
const agent = await createAgent({
  systemPrompt: configVars.SYSTEM_PROMPT,
  openAIKey: configVars.OPENAI_API_KEY,
  tools: [webSearchTool]
});

// Process and respond via Slack Assistant
await assistant.threadStarted({ event, say });
```

## Prerequisites

- Prismatic account
- Slack workspace with admin access
- OpenAI API key
- Tavily API key for web search
- Node.js 18+
- Prism CLI (`npm install -g @prismatic-io/prism`)

## Getting Started

This example shows the key patterns for integrating with Slack's Assistant framework. You can extend it with your own tools, customize the AI behavior, and adapt it to your specific use cases.

## Quick Start

### Deploy

```bash
# Clone and install
git clone <repository-url>
cd slack-chatbot-agent
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Slack app credentials

# Deploy to Prismatic
prism login
npm run build
npm run import
```

### Configure

1. Navigate to your integration in Prismatic UI
2. Configure Slack OAuth connection
3. Add OpenAI and Tavily API keys
4. Customize system prompt (optional)
5. Deploy instance and note webhook URL

### Environment Variables

```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_SIGNING_SECRET=your_slack_signing_secret
OPENAI_API_KEY=sk-proj-...
TAVILY_API_KEY=tvly-...
```

## Configuration

### Slack Connection (OAuth2)

Automatically configured from environment variables with required scopes:
- `app_mentions:read` - Read mentions of the app
- `chat:write` - Send messages as the app
- `commands` - Add slash commands
- `im:history` - Access direct message history
- `assistant:write` - Use Slack's Assistant features

### Required Config Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `TAVILY_API_KEY`: Tavily API key for web search ([tavily.com](https://tavily.com))
- `SYSTEM_PROMPT`: Instructions for agent behavior

### Optional Config Variables
- `PRISMATIC_SIGNING_KEY`: Your Prismatic signing key for embedded user authentication. When provided, enables dynamic discovery and invocation of customer-specific integrations as AI tools

## Development

### Local Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
slack-chatbot-agent/
├── src/
│   ├── index.ts                 # Integration entry point
│   ├── configPages.ts           # UI configuration
│   ├── flows/
│   │   └── eventHandler.ts      # Webhook handler flow
│   ├── agents/
│   │   ├── agentFactory.ts      # Agent creation utilities
│   │   ├── prompts.ts           # System prompts
│   │   └── tools/
│   │       ├── webSearch.ts     # Web search tool
│   │       ├── tavilySearch.ts  # Tavily API client
│   │       └── prismaticIntegrations.ts # Dynamic integration discovery
│   ├── slack/
│   │   ├── app.ts               # Slack app setup
│   │   ├── assistant.ts         # Assistant framework
│   │   └── webhookReceiver.ts   # Custom receiver
│   └── test/
│       └── index.test.ts        # Flow tests
├── package.json
├── tsconfig.json
└── esbuild.config.js
```


## Usage Examples

```
User: How do I reset my password in Prismatic?
Bot: *searches documentation* To reset your password in Prismatic, follow these steps...

User: What's the difference between CNI and built-in components?
Bot: *searches Prismatic docs* Code-Native Integrations (CNI) allow you to write custom logic...

User: What are the latest features in the platform?
Bot: *searches recent updates* Here are the latest features released...
```

**Use cases**: Documentation search, technical support, API reference lookup, integration guidance

## Advanced Features

### Dynamic Integration Discovery

When configured with a Prismatic signing key, this example demonstrates how to build multi-tenant AI assistants that can:

1. **Automatic Tool Generation**: On startup, the assistant queries Prismatic's API to discover all enabled integrations for the current customer and converts them into callable AI tools.

2. **Customer Isolation**: Each customer's AI assistant only has access to their specific integrations, maintaining secure multi-tenant boundaries.

3. **Schema-Aware Invocation**: Integration parameters are automatically extracted and provided to the AI, ensuring proper tool usage.

Example scenario: A customer has a Salesforce integration and a custom ERP integration deployed. Their Slack AI assistant automatically gains the ability to query Salesforce records and trigger ERP workflows without any code changes.

### Configuration for Multi-Tenant Support

To enable dynamic integration discovery:

1. Generate a Prismatic signing key from your organization settings
2. Add it to the integration configuration
3. The AI will automatically discover and use customer-specific integrations

This pattern is particularly powerful for B2B SaaS companies that want to provide AI assistants that can interact with each customer's unique integration landscape.

## Extending

### Adding Custom Tools

```typescript
import { tool } from '@openai/agents';
import { z } from 'zod';

const myCustomTool = tool({
    name: 'my_tool',
    description: 'What this tool does',
    parameters: z.object({
        query: z.string().describe('Search query'),
    }),
    async execute({ query }) {
        // Tool implementation
        return await myAPI.search(query);
    },
});
```

### Customizing Search Domains

Configure Tavily to focus on specific domains or exclude others through the search parameters.

## Troubleshooting

### Bot Not Responding
1. Check webhook URL in Slack app settings
2. Verify API keys are correctly configured
3. Check Prismatic instance logs

### Search Not Working
1. Verify Tavily API key is valid
2. Check rate limits
3. Review search query logs

### Authentication Issues
1. Re-authorize Slack OAuth connection
2. Verify signing secret matches
3. Check token scopes

## Security

- All API keys stored encrypted in Prismatic
- Webhook signatures verified cryptographically
- No conversation data persisted
- Minimal permission scopes requested
- HTTPS for all external communications

## Resources

- [OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-js/)
- [Prismatic Documentation](https://prismatic.io/docs)
- [Slack API Documentation](https://api.slack.com)
- [Tavily API Documentation](https://docs.tavily.com)

## Support

- Issues: Open an issue in this repository

---

Built with [Prismatic](https://prismatic.io) - The embedded integration platform for B2B software companies