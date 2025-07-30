# OpenAI Agent Integration for Prismatic

A reference implementation for building OpenAI agents on Prismatic's Code-Native Integration platform. This repository demonstrates best practices for creating conversational AI integrations with tool usage, approval flows, and agent routing patterns.

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd openai-agent
npm install

# Set up environment
cp .env.example .env
# Add your OpenAI API key to .env

# Test locally with interactive chat
npm run chat

# Deploy to Prismatic
npm run import
```

## 📚 Overview

This integration provides seven production-ready flows that showcase different OpenAI Agent SDK patterns:

1. **Basic Chat** - Simple conversational agent
2. **API Agent** - Wraps your API endpoints as AI tools
3. **Human Approval** - Human-in-the-loop for sensitive operations
4. **Agent Routing** - Dynamic routing to specialized agents
5. **Integrations as Tools** - Use deployed Prismatic integrations as tools
6. **Agent as Tools** - Compose specialized agents as reusable tools
7. **Hosted Tools** - OpenAI's built-in web search and code interpreter

## 🎯 Interactive Testing

This repository includes interactive chat scripts for testing each flow locally or against deployed Prismatic instances.

### Local Testing

Test flows locally without deployment:

```bash
# Basic conversational AI
npm run chat

# API tools with approval flow
npm run chat:api

# Agent routing demonstration
npm run chat:routing

# Test all available scripts
npm run chat:tools        # Agent composition
npm run chat:hosted       # OpenAI hosted tools
npm run chat:integrations # Prismatic integrations as tools
```

### Prismatic Testing

Test against deployed system instances:

```bash
# Set Prismatic credentials
export PRISMATIC_REFRESH_TOKEN=your-token

# Import and deploy
npm run import

# Test against deployed instance
npm run chat  # Automatically detects Prismatic mode
```

## 🔧 Flows

### 1. Basic Chat (`basicChat`)

Simple conversational AI without tools.

**Use cases**: Q&A, chatbots, content generation

**Test it**:

```bash
npm run chat
```

### 2. API Agent (`apiAgent`)

Demonstrates wrapping REST APIs as AI tools. Includes approval flow for write operations.

**Available tools**:

- `get_current_user_info` - Fetch user details
- `get_users_posts` - List user posts
- `get_post` - Get specific post
- `create_post` ⚠️ - Create post (requires approval)
- `update_post` ⚠️ - Update post (requires approval)
- `get_post_comments` - Fetch comments

**Use cases**: API orchestration, data access, CRUD operations

**Test it**:

```bash
npm run chat:api
# Try: "Create a post about AI"
# The tool will pause for your approval
```

### 3. Human Approval Flow (`humanApprovalFlow`)

Implements human-in-the-loop approval for sensitive operations.

**Key features**:

- Interrupt/resume pattern
- State serialization
- Approval UI formatting
- Conversation continuity

**Use cases**: Financial transactions, data modifications, compliance workflows

**Test it**:

```bash
npm run chat:approval
# Try: "Update post 1 with new content"
```

### 4. Agent Routing (`agentRouting`)

Intelligent routing to specialized agents using handoff patterns.

**Specialized agents**:

- **Triage Agent** - Routes based on intent
- **Order Lookup Agent** - Handles order queries
- **Support Agent** - Creates support tickets

**Use cases**: Multi-system workflows, intent-based routing, specialized handling

**Test it**:

```bash
npm run chat:routing
# Try: "Where is my order ORD-12345?"
```

### 5. Integrations as Tools (`integrationsAsTools`)

Uses deployed Prismatic integrations as AI tools. Dynamically loads available integrations for a customer.

**Setup**:

```bash
export CUSTOMER_EXTERNAL_ID=your-customer-id
npm run chat:integrations
```

**Use cases**: Customer-specific tools, multi-tenant scenarios, dynamic tool loading

### 6. Agent as Tools (`agentAsTools`)

Demonstrates composing specialized agents as reusable tools.

**Available agents**:

- **Summarizer** - Text summarization specialist

**Use cases**: Multi-agent systems, task delegation, modular AI

**Test it**:

```bash
npm run chat:tools
# Try: "Summarize this text: [paste long text]"
```

### 7. Hosted Tools (`hostedTools`)

Leverages OpenAI's built-in hosted tools.

**Available tools**:

- `web_search` - Real-time web information
- Other OpenAI-provided tools as available

**Use cases**: Current events, web research, real-time data

**Test it**:

```bash
npm run chat:hosted
# Try: "Search for the latest AI news"
```

## 🏗️ Architecture

### Standardized Flow Input/Output

All flows use a standardized format for consistency:

```typescript
// Input
interface FlowInput {
  conversationId: string;
  message: string | null;
  previousExecutionId?: string;
  approval?: {
    approved: boolean;
    feedback?: string;
  };
}

// Output
interface FlowOutput {
  agentState: {
    finalOutput?: string;
    pendingApproval?: {
      toolName: string;
      arguments: any;
    };
  };
  executionId: string;
}
```

### Chat Script Architecture

The interactive chat scripts use a shared functional library for consistency:

```typescript
// scripts/lib/chat-utils.ts
export async function runChatLoop(config: {
  flow: any;
  flowName: string;
  stableKey: string;
  description?: string;
  examplePrompts?: string[];
});

// Individual scripts are simple configurations
// scripts/chat.ts
runChatLoop({
  flow: basicChat,
  flowName: "Basic Chat",
  stableKey: "basic-chat",
  description: "Simple conversational AI",
});
```

### Flow Implementation Pattern

```typescript
export const myFlow = flow({
  name: "My Flow",
  stableKey: "my-flow",
  onExecution: async ({ configVars, executionId }, params) => {
    // 1. Parse standardized input
    const input = parseFlowInput(params.onTrigger.results.body.data);

    // 2. Setup agent with tools
    const runner = await setupAgent({
      systemPrompt: configVars.SYSTEM_PROMPT,
      openAIKey: configVars.OPENAI_API_KEY,
      tools: [
        /* your tools */
      ],
    });

    // 3. Handle message or approval
    if (isApprovalInput(input)) {
      await runner.runWithDecision(/*...*/);
    } else {
      await runner.run(/*...*/);
    }

    // 4. Return standardized output
    return {
      data: buildFlowOutput(runner.storage.getLastSavedState(), executionId),
    };
  },
});
```

## 📁 Project Structure

```
openai-agent/
├── scripts/                      # Interactive chat scripts
│   ├── lib/
│   │   └── chat-utils.ts        # Shared chat utilities
│   ├── chat.ts                  # Basic chat
│   ├── chat-api.ts              # API tools chat
│   ├── chat-approval.ts         # Approval flow chat
│   ├── chat-routing.ts          # Agent routing chat
│   ├── chat-tools.ts            # Agent as tools chat
│   ├── chat-hosted.ts           # Hosted tools chat
│   └── chat-integrations.ts     # Integrations chat
├── src/
│   ├── flows/                   # Prismatic flows
│   │   ├── basicChat.ts
│   │   ├── apiAgent.ts
│   │   ├── humanApprovalFlow.ts
│   │   ├── agentRouting.ts
│   │   ├── integrationsAsTools.ts
│   │   ├── agentAsTools.ts
│   │   ├── hostedTools.ts
│   │   └── utils/
│   │       └── flowHelpers.ts   # Flow utilities
│   ├── agents/                  # Agent configuration
│   │   ├── setup.ts             # Agent setup utilities
│   │   ├── state/               # State management
│   │   ├── types/               # TypeScript types
│   │   └── tools/               # Tool definitions
│   │       ├── api.ts           # API tools
│   │       ├── agents.ts        # Agent tools
│   │       ├── approvalTool.ts  # Approval handling
│   │       └── prismaticTools.ts # Prismatic tools
│   ├── prismatic/               # Prismatic API client
│   │   ├── api/                # API functions
│   │   ├── auth/               # Authentication
│   │   ├── client/             # Client setup
│   │   └── types.ts            # Type definitions
│   ├── types/                   # Shared types
│   │   └── flow.types.ts       # Flow interfaces
│   └── test/                    # Tests
├── .spectral/                   # Prismatic config
│   └── prism.json              # Integration ID
├── package.json
└── README.md
```

## 🔑 Configuration

### Environment Variables

```bash
# Required for all flows
OPENAI_API_KEY=sk-proj-...

# Optional: Enable Prismatic mode
PRISMATIC_REFRESH_TOKEN=your-refresh-token

# Optional: For integrationsAsTools flow
CUSTOMER_EXTERNAL_ID=customer-123

# Optional: Custom system prompt
SYSTEM_PROMPT="You are a helpful assistant"
```

### Prismatic Deployment

1. **Import the integration**:

```bash
npm run import
# Creates .spectral/prism.json with integration ID
```

2. **Deploy system instance**:

- Navigate to Prismatic UI
- Deploy a system instance
- Configure OpenAI API key

3. **Test with chat scripts**:

```bash
export PRISMATIC_REFRESH_TOKEN=your-token
npm run chat  # Automatically uses webhook mode
```

## 🧩 Extending

### Adding a New Flow

1. Create flow in `src/flows/`:

```typescript
import { flow } from "@prismatic-io/spectral";
import { setupAgent } from "../agents/setup";
import { parseFlowInput, buildFlowOutput } from "./utils/flowHelpers";

export const myFlow = flow({
  name: "My Flow",
  stableKey: "my-flow",
  onExecution: async ({ configVars, executionId }, params) => {
    const input = parseFlowInput(params.onTrigger.results.body.data);

    const runner = await setupAgent({
      systemPrompt: configVars.SYSTEM_PROMPT,
      openAIKey: configVars.OPENAI_API_KEY.fields.apiKey,
      tools: [
        /* your tools */
      ],
    });

    await runner.run(input.message, input.conversationId);

    return {
      data: buildFlowOutput(runner.storage.getLastSavedState(), executionId),
    };
  },
});
```

2. Add to `src/flows/index.ts`

3. Create chat script in `scripts/`:

```typescript
#!/usr/bin/env node
import { runChatLoop } from "./lib/chat-utils";
import { myFlow } from "../src/flows/myFlow";

runChatLoop({
  flow: myFlow,
  flowName: "My Flow",
  stableKey: "my-flow",
  description: "What my flow does",
});
```

### Creating Custom Tools

```typescript
import { tool } from "@openai/agents";
import { z } from "zod";

const myTool = tool({
  name: "my_tool",
  description: "What this tool does",
  parameters: z.object({
    input: z.string().describe("Tool input"),
  }),
  async execute({ input }) {
    // Implementation
    return `Result: ${input}`;
  },
  needsApproval: true, // Optional: require approval
});
```

### Wrapping Your API

```typescript
// src/agents/tools/myapi.ts
const API_BASE = "https://api.example.com";

const getResource = tool({
  name: "get_resource",
  description: "Fetch a resource",
  parameters: z.object({
    id: z.string(),
  }),
  async execute({ id }) {
    const response = await fetch(`${API_BASE}/resources/${id}`);
    return await response.json();
  },
});

export default { getResource };
```

## 🧪 Testing

### Unit Tests

```bash
npm test           # Run all tests
npm run test:ui    # Vitest UI
```

### Interactive Testing

```bash
# Test each flow interactively
npm run chat
npm run chat:api
npm run chat:routing
# ... etc
```

### Webhook Testing

```bash
# Test deployed instance
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "test-123",
    "message": "Hello, how are you?"
  }'
```

## 📚 Resources

- [OpenAI Agents SDK](https://github.com/openai/openai-agents-js)
- [Prismatic Documentation](https://prismatic.io/docs)

## 🤝 Contributing

This is reference architecture for Prismatic customers. Feel free to:

- Fork and adapt for your use case
- Submit issues for bugs or questions

---

Built with [Prismatic](https://prismatic.io) - The embedded integration platform for B2B software companies
