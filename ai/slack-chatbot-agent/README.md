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

### Test It

```bash
npm test  # Runs unit tests with mock Slack events
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
    // Phase 2: Async agent processing
    const runner = await setupAgent({
      openAIKey: configVars.OPENAI_API_KEY,
      systemPrompt: configVars.SYSTEM_PROMPT,
      customer: customer,
      prismaticRefreshToken,
      excludeIntegrationId: integration.id,
    });

    const result = await runner.run(
      userInput,
      conversationId,
      previousExecutionId,
    );

    if (result.needsApproval) {
      // Display approval UI
      await showApprovalBlocks(state.pendingApproval);
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

Conversation state with support for approval interruptions:

```typescript
interface AgentState {
  conversationId: string;
  history: AgentInputItem[]; // Full conversation history
  runState?: string; // Serialized for resumption
  metadata: {
    timestamp: number;
    interrupted: boolean;
    lastExecutionId?: string;
  };
  pendingApproval?: {
    // Present when approval needed
    toolName: string;
    arguments: any;
  };
}
```

### Approval Flow Sequence

1. Agent attempts to execute a tool marked with `needsApproval: true`
2. Execution is interrupted and state is persisted
3. Slack UI displays interactive approval blocks
4. User clicks Approve/Deny button
5. Agent resumes execution with the decision
6. Process continues or terminates based on approval

## 📁 Project Structure

```
slack-chatbot-agent/
├── src/
│   ├── flows/
│   │   ├── eventHandler.ts      # Main webhook flow
│   │   └── index.ts              # Flow exports
│   ├── agents/
│   │   ├── index.ts              # Core agent logic
│   │   ├── setup.ts              # Agent configuration
│   │   ├── prompts.ts            # System prompts
│   │   ├── state/                # State persistence
│   │   │   ├── index.ts          # State factory
│   │   │   ├── fileStorage.ts    # Development storage
│   │   │   ├── prismaticStorage.ts # Production storage
│   │   │   └── types.ts          # State interfaces
│   │   ├── tools/
│   │   │   ├── prismaticTools.ts # Dynamic tool creation
│   │   │   ├── approvalTool.ts   # Approval examples
│   │   │   └── openaiHostedTools.ts # OpenAI tools
│   │   └── types/
│   │       └── index.ts          # Agent types
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
│   ├── configPages.ts            # Integration config
│   ├── componentRegistry.ts      # Component setup
│   ├── index.ts                  # Entry point
│   └── test/
│       ├── index.test.ts         # Flow tests
│       ├── agent.test.ts         # Agent tests
│       └── testPayload.ts        # Test fixtures
├── assets/
│   └── icon.png                  # Integration icon
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── esbuild.config.js
├── test.sh
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

### Slack App Setup

1. **Create Slack App**:

   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Click "Create New App" → "From scratch"
   - Name your app and select workspace

2. **Configure OAuth Scopes**:

   ```
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
// src/agents/tools/custom.ts
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

// Add to agent setup
const tools = [...existingTools, customTool];
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

### Implementing Custom State Storage

Create a custom storage backend:

```typescript
// src/agents/state/customStorage.ts
import { StateStorage, AgentState } from "./types";

export class CustomStorage implements StateStorage {
  async save(state: AgentState): Promise<void> {
    // Custom save logic
    await myDatabase.save(state.conversationId, state);
  }

  async load(
    conversationId: string,
    executionId: string,
  ): Promise<AgentState | null> {
    // Custom load logic
    return await myDatabase.load(conversationId);
  }

  getLastSavedState(): AgentState | null {
    // Return cached state
    return this.lastState;
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
npm test           # Run all tests
npm run test:ui    # Vitest UI
npm run lint       # ESLint
npm run format     # Prettier
```

### Test Coverage

The test suite includes:

- **Flow Tests** (`index.test.ts`): Webhook handling and Slack event processing
- **Agent Tests** (`agent.test.ts`): Agent behavior, approval flows, and state management
- **Mock Payloads** (`testPayload.ts`): Realistic Slack event fixtures

### Example Test

```typescript
// Testing approval flow
test("should handle approval interruption", async () => {
  const agent = await setupAgent({
    openAIKey: process.env.OPENAI_API_KEY!,
    systemPrompt: "You are a helpful assistant.",
    includeApprovalTools: true,
  });

  // Trigger approval-required tool
  const result = await agent.run(
    "Deploy v1 to production",
    "test-conversation",
  );

  expect(result.needsApproval).toBe(true);

  // Resume with approval
  const approved = await agent.resume(
    "test-conversation",
    "test-execution-id",
    { approved: true },
  );

  expect(approved.finalOutput).toContain("deployed");
});
```

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
