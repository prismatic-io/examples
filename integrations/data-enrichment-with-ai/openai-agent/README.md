# OpenAI Agent Integration for Prismatic

A reference implementation for building OpenAI agents on Prismatic's Code-Native Integration platform. This repository demonstrates best practices for creating conversational AI integrations with tool usage and agent routing patterns.

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

This integration provides six production-ready flows that showcase different OpenAI Agent SDK patterns:

1. **Basic Chat** - Simple conversational agent
2. **API Agent** - Wraps your API endpoints as AI tools
3. **Agent Routing** - Dynamic routing to specialized agents
4. **Integrations as Tools** - Use deployed Prismatic integrations as tools
5. **Agent as Tools** - Compose specialized agents as reusable tools
6. **Hosted Tools** - OpenAI's built-in web search and code interpreter

## 🎯 Interactive Testing

This repository includes interactive chat scripts for testing each flow locally or against deployed Prismatic instances.

### Local Testing

Test flows locally without deployment:

```bash
# Basic conversational AI
npm run chat

# API tools demonstration
npm run chat:api

# Agent routing demonstration
npm run chat:routing

# Test other available scripts
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

Demonstrates wrapping REST APIs as AI tools for data access and manipulation.

**Available tools**:

- `get_current_user_info` - Fetch user details
- `get_users_posts` - List user posts
- `get_post` - Get specific post
- `get_post_comments` - Fetch comments

**Use cases**: API orchestration, data access, read operations

**Test it**:

```bash
npm run chat:api
# Try: "Show me the latest posts"
```

### 3. Agent Routing (`agentRouting`)

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

### 4. Integrations as Tools (`integrationsAsTools`)

Uses deployed Prismatic integrations as AI tools. Dynamically loads available integrations for a customer.

**Setup**:

```bash
export CUSTOMER_EXTERNAL_ID=your-customer-id
npm run chat:integrations
```

**Use cases**: Customer-specific tools, multi-tenant scenarios, dynamic tool loading

### 5. Agent as Tools (`agentAsTools`)

Demonstrates composing specialized agents as reusable tools.

**Available agents**:

- **Summarizer** - Text summarization specialist

**Use cases**: Multi-agent systems, task delegation, modular AI

**Test it**:

```bash
npm run chat:tools
# Try: "Summarize this text: [paste long text]"
```

### 6. Hosted Tools (`hostedTools`)

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

### Flow Input/Output Types

Flows use simple request/response types:

```typescript
// Input
interface ChatRequest {
  message?: string | null;
  conversationId: string;
  lastResponseId?: string;
  interruptions?: Interruption[];
  state?: string;
}

// Output
interface ChatResponse {
  response?: string;
  conversationId: string;
  lastResponseId: string;
  interruptions?: Interruption[];
  state?: string;
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
  onExecution: async ({ configVars }, params) => {
    // 1. Set OpenAI key
    setDefaultOpenAIKey(configVars.OPENAI_API_KEY.fields.apiKey);

    // 2. Create agent directly
    const agent = new Agent({
      name: "Assistant",
      instructions: configVars.SYSTEM_PROMPT,
      tools: [
        /* your tools */
      ],
    });

    // 3. Get input
    const { message, conversationId, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;

    // 4. Run agent
    const result = await run(agent, [user(message)], {
      previousResponseId: lastResponseId,
    });

    // 5. Return response
    return {
      data: {
        response: result.finalOutput,
        lastResponseId: result.lastResponseId,
        conversationId,
      },
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
│   ├── chat-routing.ts          # Agent routing chat
│   ├── chat-tools.ts            # Agent as tools chat
│   ├── chat-hosted.ts           # Hosted tools chat
│   └── chat-integrations.ts     # Integrations chat
├── src/
│   ├── flows/                   # Prismatic flows
│   │   ├── basicChat.ts
│   │   ├── apiAgent.ts
│   │   ├── agentRouting.ts
│   │   ├── integrationsAsTools.ts
│   │   ├── agentAsTools.ts
│   │   ├── hostedTools.ts
│   │   └── utils/
│   │       └── flowHelpers.ts   # Flow utilities
│   ├── agents/                  # Agent tools
│   │   └── tools/               # Tool definitions
│   │       ├── api.ts           # API tools
│   │       ├── agents.ts        # Agent tools
│   │       ├── hosted.ts        # Hosted tools
│   │       ├── prismaticHostedTools.ts # Prismatic hosted tools
│   │       └── prismaticTools.ts # Prismatic integration tools
│   ├── prismatic/               # Prismatic API client
│   │   ├── api/                # API functions
│   │   ├── auth/               # Authentication
│   │   ├── client/             # Client setup
│   │   └── types.ts            # Type definitions
│   ├── types.ts                 # Core types (ChatRequest, ChatResponse)
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
import { Agent, run, setDefaultOpenAIKey, user } from "@openai/agents";
import { ChatRequest } from "../types";

export const myFlow = flow({
  name: "My Flow",
  stableKey: "my-flow",
  onExecution: async ({ configVars }, params) => {
    // Set API key
    setDefaultOpenAIKey(configVars.OPENAI_API_KEY.fields.apiKey);

    // Create agent
    const agent = new Agent({
      name: "My Assistant",
      instructions: configVars.SYSTEM_PROMPT,
      tools: [
        /* your tools */
      ],
    });

    // Get input
    const { message, conversationId, lastResponseId } = params.onTrigger.results
      .body.data as ChatRequest;

    // Run agent
    const result = await run(agent, [user(message)], {
      previousResponseId: lastResponseId,
    });

    return {
      data: {
        response: result.finalOutput,
        lastResponseId: result.lastResponseId,
        conversationId,
      },
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
