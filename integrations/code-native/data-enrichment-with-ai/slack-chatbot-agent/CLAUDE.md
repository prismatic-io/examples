# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build & Deploy

- Build the integration: `npm run build`
- Deploy to Prismatic: `npm run import` (builds first, then imports)
- Login to Prismatic CLI: `prism login`

### Testing & Quality

- Run unit tests: `npm test` (vitest run)
- Type-check: `npm run typecheck` (tsc --noEmit)
- Run linting: `npm run lint` (Biome)
- Apply safe lint fixes and organize imports: `npx biome check --write .`
- Format code: `npx biome format --write .`

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

3. **Dynamic Tool Discovery**: When configured with a Prismatic refresh token, the agent dynamically discovers and exposes customer-specific integrations as AI tools using embedded user authentication

4. **State Management**: Conversation state tracked using `instanceState` with serialized agent state for approval resumption

### Core Components

- **Entry Point**: `src/index.ts` - Defines the integration with flows, config pages, and component registry
- **Main Flow**: `src/flows/eventHandler.ts` - Handles webhook events with direct Agent SDK usage, immediate acknowledgment and async processing
- **Prismatic Client**: `src/prismatic/` - Reusable client library for Prismatic API operations
  - `auth/` - JWT generation, embedded auth, and token refresh
  - `client/` - Customer and organization client factories with GraphQL operations
  - `api/` - Flow, integration, customer, and execution management functions
- **Slack App**: `src/slack/app.ts` - Configures Bolt app with custom webhook receiver and inline assistant handling
- **Tools**: `src/agents/tools/` - Tool implementations
  - `prismaticTools.ts` - Converts Prismatic flows into OpenAI agent tools and includes approval tools
  - `approvalTools.ts` - Approval tool implementations
  - `openaiHostedTools.ts` - OpenAI hosted tools integration

### Configuration System

The integration uses Prismatic's config system with:

- OAuth2 connection for Slack (client ID, secret, signing secret)
- API key connection for OpenAI
- Prismatic refresh token for organization API access
- System prompt customization

All configuration is managed through `src/configPages.ts` and accessed via `configVars` in the flow.

### Testing Approach

Unit tests in `src/index.test.ts` cover Slack signature verification, retry detection and the approval Block Kit UI; run them with `npm test`. End-to-end behavior is tested through deployment and direct Slack interaction:

- Build and deploy: `npm run import`
- Run tests with a real Slack connection from a deployed instance: `./test.sh`

### Deployment Notes

This integration is designed to be deployed to Prismatic's platform using the Prism CLI. The build process uses tsdown (`tsdown.config.mts`) to bundle all dependencies into a single CommonJS module (`dist/index.js`) that Prismatic can execute. At build time, `SLACK_*`, `OPENAI_*` and `PRISMATIC_*` values from `.env` are inlined as config wizard defaults.
