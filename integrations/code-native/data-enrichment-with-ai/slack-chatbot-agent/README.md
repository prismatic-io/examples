# Slack Chatbot Agent for Prismatic

A production-ready reference implementation for building AI-powered Slack assistants on Prismatic's Code-Native Integration platform using OpenAI's Agent SDK and Slack's Assistant framework.

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd slack-chatbot-agent
npm install

# Set up environment
cp .env.example .env
# Configure Slack app credentials and OpenAI API key in .env

# Run tests
npm test

# Deploy to Prismatic
npm run import
```

## 📚 Overview

This integration provides a production-ready webhook-based flow that handles Slack Assistant events with AI capabilities, approval workflows, and dynamic tool discovery.

**Key capabilities:**

1. **Slack Assistant Framework** - Native integration with Slack's AI conversation model
2. **Approval Workflows** - Human-in-the-loop pattern for sensitive operations
3. **Dynamic Tool Discovery** - Automatically exposes customer's Prismatic integrations as AI tools
4. **State Management** - Conversation persistence across message threads
5. **Multi-tenant Support** - Secure customer isolation with embedded authentication

## 🔧 Flow: Slack Event Handler

### Description

Production-ready webhook handler for Slack Assistant events with OpenAI agent processing.

### Key Features

- Two-phase execution (immediate ACK + async processing)
- Retry detection and handling
- Thread-based conversation tracking
- Approval UI with Slack blocks
- Dynamic Prismatic tool loading
- Self-invocation prevention

### Available Tools

- **Customer Integrations** - Dynamically discovered from deployed Prismatic integrations
- **OpenAI Hosted Tools** - Web search and other OpenAI-provided capabilities
- **Approval Tools** - Example tools demonstrating the approval pattern

### Use Cases

- Customer support automation
- Workflow approval systems
- Multi-step operations with state

### Deploy & Test

```bash
npm run import  # Build and deploy to Prismatic
# Test directly in Slack after deployment
```

## 🏗️ Architecture

### Webhook Flow Pattern

The integration uses a two-phase execution model to handle Slack's 3-second response requirement:

```typescript
flow({
  name: "Slack Message Handler",
  stableKey: "slack-event-handler",

  onTrigger: async (context, payload) => {
    // Phase 1: Immediate acknowledgment
    const { response } = ack(payload, signingSecret);
    return { payload, response };
  },

  onExecution: async (context, params) => {
    // Phase 2: Direct agent creation and processing
    const agent = new Agent({
      name: "Slack Assistant",
      instructions: configVars.SYSTEM_PROMPT,
      tools: await buildTools(customer, prismaticRefreshToken, integration.id),
    });

    // Run agent with user input
    const result = await run(agent, [user(userInput)], {
      previousResponseId: lastResponseId,
    });

    if (result.interruptions && result.interruptions.length > 0) {
      // Display approval UI
      await showApprovalBlocks(result.interruptions[0]);
    } else {
      // Send response
      await client.chat.postMessage({
        text: result.finalOutput,
      });
    }
  },
});
```

### State Management Pattern

Simplified conversation state using instanceState:

```typescript
interface ConversationState {
  lastResponseId?: string;
  state?: string; // Serialized agent state for resumption
  pendingInterruption?: {
    functionId: string;
    name: string;
    arguments: unknown;
  };
}

// State is stored directly in instanceState
instanceState[conversationId] = {
  state: result.state.toString(),
  lastResponseId: result.lastResponseId,
  pendingInterruption: {
    /* ... */
  },
} as ConversationState;
```

### Approval Flow Sequence

1. Agent attempts to execute a tool marked with `needsApproval: true`
2. Execution is interrupted and state is persisted
3. Slack UI displays interactive approval blocks
4. User clicks Approve/Deny button
5. Agent resumes execution with the decision
6. Process continues or terminates based on approval

## 📁 Project Structure

```text
slack-chatbot-agent/
├── src/
│   ├── flows/
│   │   ├── eventHandler.ts      # Main webhook flow with inline agent
│   │   └── index.ts              # Flow exports
│   ├── agents/
│   │   └── tools/
│   │       ├── prismaticTools.ts # Dynamic tool creation + approval tools
│   │       ├── approvalTools.ts  # Approval tool implementations
│   │       └── openaiHostedTools.ts # OpenAI hosted tools
│   ├── slack/
│   │   ├── app.ts                # Bolt app setup
│   │   ├── acknowledge.ts        # Webhook ACK logic
│   │   ├── webhookReceiver.ts    # Custom receiver
│   │   ├── blocks/
│   │   │   └── approvalBlocks.ts # UI components
│   │   ├── middleware/
│   │   │   └── filterBotMessage.ts # Message filtering
│   │   ├── types/
│   │   │   └── index.ts          # Slack types
│   │   └── util.ts               # Helper functions
│   ├── prismatic/                # Reusable API client
│   │   ├── api/                  # API operations
│   │   │   ├── customers.ts
│   │   │   ├── executions.ts
│   │   │   ├── flows.ts
│   │   │   ├── integrations.ts
│   │   │   └── index.ts
│   │   ├── auth/                 # Authentication
│   │   │   ├── embedded.ts       # Embedded user auth
│   │   │   ├── jwt.ts            # JWT generation
│   │   │   ├── refresh.ts        # Token refresh
│   │   │   └── index.ts
│   │   ├── client/               # GraphQL clients
│   │   │   ├── customer.ts
│   │   │   ├── organization.ts
│   │   │   ├── graphql.ts
│   │   │   └── index.ts
│   │   ├── types.ts              # Prismatic types
│   │   └── index.ts              # Main exports
│   ├── types.ts                  # Core type definitions
│   ├── configPages.ts            # Integration config
│   ├── componentRegistry.ts      # Component setup
│   ├── index.test.ts             # Unit tests
│   └── index.ts                  # Entry point
├── assets/
│   └── icon.png                  # Integration icon
├── .spectral/
│   ├── index.ts                  # Type augmentation for config pages / component registry
│   └── prism.json                # Integration ID (gitignored, written by `npm run import`)
├── package.json
├── biome.json                    # Biome lint/format config
├── tsconfig.json
├── tsdown.config.mts             # Build config (bundles to dist/index.js)
├── vitest.config.mts
├── test.sh                       # Run tests with a real Slack connection from Prismatic
├── CLAUDE.md                      # AI development guide
└── README.md
```

## 🔑 Configuration

### Environment Variables

```bash
# Required: Slack App Credentials
SLACK_CLIENT_ID=your_client_id
SLACK_CLIENT_SECRET=your_client_secret
SLACK_SIGNING_SECRET=your_signing_secret

# Required: OpenAI
OPENAI_API_KEY=sk-proj-...

# Optional: Enable Prismatic tools
PRISMATIC_REFRESH_TOKEN=your-refresh-token

# Optional: Custom system prompt
SYSTEM_PROMPT="You are a helpful assistant"
```

`npm run build` inlines the `SLACK_*`, `OPENAI_*` and `PRISMATIC_*` values from `.env` into the bundle as the default values of the config wizard inputs. Leave them out of `.env` if you do not want them baked into the build.

### Slack App Setup

1. **Create Slack App**:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App" → "From scratch"
   - Name your app and select workspace

2. **Configure OAuth Scopes**:

   ```text
   app_mentions:read
   chat:write
   commands
   im:history
   assistant:write
   ```

3. **Enable Assistant**:
   - Navigate to "Assistant" in sidebar
   - Enable Assistant capabilities
   - Configure Assistant settings

4. **Get Credentials**:
   - Client ID/Secret from "Basic Information"
   - Signing Secret from "Basic Information"
   - Add to `.env` file

### Prismatic Deployment

1. **Import Integration**:

```bash
npm run import
# Creates .spectral/prism.json with integration ID
```

2. **Deploy Instance**:
   - Navigate to Prismatic UI
   - Create system instance
   - Configure connections and variables
   - Deploy and activate

3. **Configure Webhook**:
   - Copy webhook URL from deployed instance
   - Add to Slack app's Event Subscriptions
   - Verify endpoint

4. **Test in Slack**:
   - Install app to workspace
   - Start conversation with bot
   - Test approval flows and tools

## 🧩 Extending

### Adding Custom Tools

Create new tools for the agent to use:

```typescript
// src/agents/tools/customTools.ts
import { tool } from "@openai/agents";
import { z } from "zod";

export const customTool = tool({
  name: "custom_action",
  description: "Performs custom action",
  parameters: z.object({
    input: z.string().describe("Action input"),
    priority: z.enum(["low", "medium", "high"]),
  }),
  needsApproval: true, // Optional: require approval
  async execute({ input, priority }) {
    // Implementation
    const result = await performAction(input, priority);
    return `Completed: ${result}`;
  },
});

// Add to buildTools function in eventHandler.ts
async function buildTools(...) {
  // ... existing tools
  tools = tools.concat([customTool]);
  return tools;
}
```

### Customizing Approval Flow

Modify the approval UI and logic:

```typescript
// src/slack/blocks/approvalBlocks.ts
export function createApprovalBlocks(
  toolName: string,
  args: any,
  executionId: string,
  customContext?: any, // Add custom context
): (Block | KnownBlock)[] {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🔒 Tool Approval Required",
      },
    },
    // Add custom sections
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Risk Level:* ${calculateRisk(toolName)}`,
      },
    },
    // ... rest of blocks
  ];
}
```

### Customizing State Management

State is managed directly through instanceState:

```typescript
// In eventHandler.ts
const convState = instanceState[conversationId] as ConversationState;

// Store state after agent run
instanceState[conversationId] = {
  state: result.state.toString(),
  lastResponseId: result.lastResponseId,
  pendingInterruption: {
    functionId: interruption.rawItem.id,
    name: interruption.rawItem.name,
    arguments: interruption.rawItem.arguments,
  },
} as ConversationState;

// Resume from stored state
const agentState = await RunState.fromString(agent, convState.state);
const result = await run(agent, agentState);
```

## 🧪 Testing

### Development

```bash
npm test                     # Run unit tests (vitest run)
npm run build                # Bundle the integration with tsdown into dist/
npm run typecheck            # Type-check with tsc --noEmit
npm run lint                 # Lint with Biome
npx biome format --write .   # Format with Biome
```

Unit tests live in `src/index.test.ts` and cover Slack signature verification, retry detection and the approval Block Kit UI. They do not require Slack or OpenAI credentials.

### Slack Testing

1. **Deploy to Prismatic** and get webhook URL
2. **Configure Slack app** with webhook
3. **Test scenarios**:
   - Normal conversations
   - Tool approvals
   - Thread continuity
   - Error handling

### Monitoring

- View execution logs in Prismatic UI
- Monitor Slack app insights
- Check error rates and response times

## 📚 Resources

- [Slack Assistant Framework](https://api.slack.com/docs/assistant) - Official Slack Assistant documentation
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) - Agent SDK documentation
- [Prismatic Documentation](https://prismatic.io/docs) - Platform documentation
- [Slack Bolt SDK](https://slack.dev/bolt-js) - Slack SDK for Node.js

## 🤝 Contributing

This is reference architecture for Prismatic customers. Feel free to:

- Fork and adapt for your use case
- Submit issues for bugs or questions
- Share your extensions and improvements

---

Built with [Prismatic](https://prismatic.io) - The embedded integration platform for B2B software companies
