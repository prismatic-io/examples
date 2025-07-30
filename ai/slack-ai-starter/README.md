# Slack AI Starter Kit for Prismatic

A minimal starter kit for building AI-powered Slack apps using OpenAI agents on Prismatic's Code-Native Integration platform. This example provides a clean foundation for creating conversational AI experiences in Slack.

## Overview

This starter kit demonstrates the basics of integrating OpenAI's Agent SDK with Slack's Assistant framework. It's designed to be simple, understandable, and easy to extend - perfect for developers who want to quickly add AI capabilities to their Slack integrations.

## Key Features

- Clean integration with Slack's Assistant framework
- OpenAI Agent SDK for conversational AI
- Thread-based conversation context
- Customizable system prompts
- Minimal dependencies and configuration
- Production-ready webhook handling

## Architecture

The integration uses a straightforward webhook-based flow:

1. Slack sends events to Prismatic webhook endpoint
2. Flow acknowledges receipt immediately (Slack 3s requirement)
3. OpenAI agent processes the message
4. Response sent back through Slack Assistant API

### Implementation Flow

```typescript
// Webhook receives Slack event
const slackEvent = params.onTrigger.results.body.data;

// Create simple AI agent
const agent = await createAgent({
  systemPrompt: configVars.SYSTEM_PROMPT,
  openAIKey: configVars.OPENAI_API_KEY,
});

// Process and respond
await assistant.threadStarted({ event, say });
```

## Prerequisites

- Prismatic account
- Slack workspace with admin access
- OpenAI API key
- Node.js 18+
- Prism CLI (`npm install -g @prismatic-io/prism`)

## Getting Started

This example provides the minimal setup needed to get an AI assistant running in Slack. You can extend it by:
- Adding custom tools for specific tasks
- Integrating with your APIs
- Implementing more complex conversation flows
- Adding persistence or memory capabilities

## Quick Start

### Deploy

```bash
# Clone and install
git clone <repository-url>
cd slack-ai-starter
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
3. Add your OpenAI API key
4. Customize system prompt (optional)
5. Deploy instance and note webhook URL

### Environment Variables

```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_SIGNING_SECRET=your_slack_signing_secret
OPENAI_API_KEY=sk-proj-...
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
- `SYSTEM_PROMPT`: Instructions for agent behavior (defaults to a friendly assistant)

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
slack-ai-starter/
├── src/
│   ├── index.ts                 # Integration entry point
│   ├── configPages.ts           # UI configuration
│   ├── flows/
│   │   └── eventHandler.ts      # Webhook handler flow
│   ├── agents/
│   │   ├── agentFactory.ts      # Agent creation utilities
│   │   └── prompts.ts           # System prompts
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
User: What's the weather like today?
Bot: I don't have access to real-time weather data, but I'd be happy to help you with other questions or tasks!

User: Can you help me write a Python function?
Bot: Of course! I'd be happy to help you write a Python function. What should the function do?

User: Explain how REST APIs work
Bot: REST APIs (Representational State Transfer) are a way for applications to communicate...
```

## Extending the Starter

### Adding Custom Logic

You can extend the agent's capabilities by modifying the system prompt or adding pre/post-processing logic:

```typescript
const agent = await createAgent({
  systemPrompt: "You are a specialized assistant for DevOps tasks...",
  openAIKey: config.openAIKey,
});
```

### Next Steps

Some ideas for extending this starter:
1. Add tools for specific tasks (web search, calculations, API calls)
2. Implement conversation memory or context storage
3. Add custom slash commands for specific actions
4. Integrate with your existing systems and APIs
5. Add analytics or logging for conversations

## Troubleshooting

### Bot Not Responding
1. Check webhook URL in Slack app settings
2. Verify OpenAI API key is correctly configured
3. Check Prismatic instance logs

### Authentication Issues
1. Re-authorize Slack OAuth connection
2. Verify signing secret matches
3. Check token scopes

## Security

- All API keys stored encrypted in Prismatic
- Webhook signatures verified cryptographically
- No conversation data persisted by default
- Minimal permission scopes requested

## Resources

- [OpenAI Agents SDK Documentation](https://github.com/openai/openai-agents-js)
- [Prismatic Documentation](https://prismatic.io/docs)
- [Slack API Documentation](https://api.slack.com)
- [Slack Assistant Framework](https://api.slack.com/docs/apps/ai)

## Support

- Issues: Open an issue in this repository

---

Built with [Prismatic](https://prismatic.io) - The embedded integration platform for B2B software companies