# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build & Deploy

- Build the integration: `npm run build`
- Deploy to Prismatic: `npm run import` (builds first, then imports)
- Login to Prismatic CLI: `prism login`

### Testing & Quality

- Run unit tests: `npm test`
- Run tests with UI: `npm run test:ui`
- Run linting: `npm run lint`
- Fix linting issues: `npm run lint-fix`
- Format code: `npm run format`

### Local Development

- Install dependencies: `npm install`
- Configure environment: Copy `.env.example` to `.env` and populate with API keys:
  - `SLACK_CLIENT_ID`
  - `SLACK_CLIENT_SECRET`
  - `SLACK_SIGNING_SECRET`
  - `OPENAI_API_KEY`
  - `PRISMATIC_REFRESH_TOKEN` (optional, for testing Prismatic tools)

## Architecture Overview

This is a Prismatic Code-Native Integration (CNI) that implements a Slack AI assistant using OpenAI's Agent SDK. The integration follows Prismatic's patterns for building webhook-based integrations with Slack's Assistant framework.

### Key Integration Patterns

1. **Webhook Flow Pattern**: The integration uses a two-phase execution model:

   - `onTrigger`: Immediately acknowledges Slack's webhook (3-second requirement) and validates signatures
   - `onExecution`: Performs the actual AI processing asynchronously

2. **Connection Management**: Slack OAuth2 connection configured through Prismatic's connection system with required scopes stored in `configPages.ts`

3. **Dynamic Tool Discovery**: When configured with a Prismatic signing key and refresh token, the agent dynamically discovers and exposes customer-specific integrations as AI tools using embedded user authentication

4. **State Management**: Conversation state tracked across executions using execution IDs stored in Slack message metadata

### Core Components

- **Entry Point**: `src/index.ts` - Defines the integration with flows, config pages, and component registry
- **Main Flow**: `src/flows/eventHandler.ts` - Handles webhook events with immediate acknowledgment and async processing
- **Prismatic Client**: `src/prismatic/` - Reusable client library for Prismatic API operations
  - `auth/` - JWT generation, embedded auth, and token refresh
  - `client/` - Customer and organization client factories with GraphQL operations
  - `api/` - Flow, integration, customer, and execution management functions
- **OpenAI Agents**: `src/agents/index.ts` - Creates OpenAI agents with optional Prismatic flow tools
- **State Storage**: `src/agents/state/` - Abstractions for conversation state persistence (file-based or Prismatic-based)
- **Slack App**: `src/slack/app.ts` - Configures Bolt app with custom webhook receiver
- **Assistant**: `src/slack/assistant.ts` - Implements Slack Assistant framework handlers with thread context
- **Tools**: `src/agents/tools/prismaticTools.ts` - Converts Prismatic flows into OpenAI agent tools

### Configuration System

The integration uses Prismatic's config system with:

- OAuth2 connection for Slack (client ID, secret, signing secret)
- API key connection for OpenAI
- Prismatic refresh token for organization API access
- System prompt customization

All configuration is managed through `src/configPages.ts` and accessed via `configVars` in the flow.

### Testing Approach

Tests use Vitest with environment variables loaded from `.env`. Test files:

- `src/test/index.test.ts` - Validates webhook flow with mock Slack payloads
- `src/test/prismatic.test.ts` - Tests Prismatic API interactions

### Deployment Notes

This integration is designed to be deployed to Prismatic's platform using the Prism CLI. The build process uses esbuild (`esbuild.config.js`) to bundle all dependencies into a single CommonJS module that Prismatic can execute.
