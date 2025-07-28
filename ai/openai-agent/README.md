# OpenAI Agent Integration for Prismatic

A starter template for building OpenAI agents on Prismatic's Code-Native Integration platform. This repository includes six example implementations that demonstrate progressively advanced agent patterns.

## Overview

This integration provides webhook-based flows that integrate OpenAI's Agent SDK with Prismatic. Each flow showcases different capabilities:

1. **Basic Chat** - Simple conversational agent without tools
2. **Hosted Tools** - Agent with OpenAI's web search and code interpreter
3. **Agent as Tools** - Advanced pattern using specialized agents as composable tools
4. **API Agent** - Demonstrates wrapping your API into agent-provided tools
5. **Human Approval Flow** - Human-in-the-loop approval for sensitive operations
6. **Agent Routing** - Dynamic agent handoff based on conversation context

## Example Flows

### 1. Basic Chat (`src/flows/basicChat.ts`)

Simple conversational AI implementation without any tools.

```typescript
const agent = await createAgent({ 
  systemPrompt: configVars.SYSTEM_PROMPT, 
  openAIKey: openaiConnection 
})
const result = await runAgent(agent, incomingMessage.messages)
```

**Use cases**: Q&A systems, chatbots, text generation

### 2. Hosted Tools (`src/flows/hostedTools.ts`)

Leverages OpenAI's built-in tools for enhanced capabilities.

```typescript
import openAiHostedTools from "../agents/tools/hosted";

const tools = openAiHostedTools(); // Returns [webSearchTool(), codeInterpreterTool()]
const agent = await createAgent({ 
  systemPrompt: configVars.SYSTEM_PROMPT, 
  openAIKey: openaiConnection, 
  tools 
})
```

**Use cases**: Real-time information retrieval, code analysis, data processing

**Available tools**:
- `webSearchTool()` - Search the web for current information
- `codeInterpreterTool()` - Execute Python code in a sandboxed environment

### 3. Agent as Tools (`src/flows/agentAsTools.ts`)

Demonstrates using specialized agents as tools within a parent agent.

```typescript
// Create a specialized agent
const summarizer = new Agent({
  name: "Summarizer",
  instructions: "Generate a concise summary of the supplied text.",
});

// Convert to tool
const summarizerTool = summarizer.asTool({
  toolName: "summarize_text",
  toolDescription: "Generate a concise summary of the supplied text.",
});

// Use in parent agent
const agent = await createAgent({
  systemPrompt: `${configVars.SYSTEM_PROMPT} \n Use the summarizer tool...`,
  openAIKey: openaiConnection,
  tools: [summarizerTool]
})
```

**Use cases**: Multi-agent workflows, specialized task delegation, modular AI systems

### 4. API Agent (`src/flows/apiAgent.ts`)

Demonstrates wrapping your API into agent-provided tools. This example uses JSONPlaceholder API to show how organizations can expose their own APIs as tools for AI agents.

```typescript
import apiTools from "../agents/tools/api";

// Define tools that wrap your API endpoints
const getCurrentUserInfo = tool({
    name: 'get_current_user_info',
    description: 'Get the info of the currently logged in user',
    parameters: z.object({}),
    async execute() {
        const response = await fetch(`${API_BASE_URL}/users/1`);
        if (!response.ok) {
            throw new Error(`Failed to fetch user info: ${response.statusText}`);
        }
        return await response.json();
    },
});

// Use API tools in agent
const agent = await createAgent({
    systemPrompt: "You are an API assistant...",
    openAIKey: openaiConnection,
    tools: [
        apiTools.getCurrentUserInfo,
        apiTools.getPosts,
        apiTools.getPost,
        apiTools.createPost,
        apiTools.updatePost,
        apiTools.getPostComments,
    ]
});
```

**Available API operations**:
- `get_current_user_info` - Fetch current user details
- `get_users_posts` - Retrieve all posts for the current user
- `get_post` - Get a specific post by ID
- `create_post` - Create a new post
- `update_post` - Update an existing post
- `get_post_comments` - Fetch comments for a post

**Use cases**: Customer data access, CRM integrations, internal tool automation, API orchestration

### 5. Human Approval Flow (`src/flows/humanApprovalFlow.ts`)

Implements human-in-the-loop approval for sensitive operations. Operations requiring approval are paused until explicitly approved or rejected.

```typescript
const result = await runAgentWithApproval(agent, messages, resumeState);

// Result includes approval state
if (result.needsApproval) {
  return {
    needsApproval: true,
    state: result.state,
    pendingApprovals: result.pendingApprovals
  };
}
```

**Key features**:
- Marks sensitive tools with `needsApproval: true`
- Serializes agent state for resume
- Supports approval/rejection with reasons
- Maintains conversation context across interruptions

**Use cases**: Financial transactions, data modifications, compliance workflows, admin operations

### 6. Agent Routing (`src/flows/agentRouting.ts`)

Demonstrates intelligent routing to specialized agents using the handoff pattern.

```typescript
import { Agent, handoff } from '@openai/agents';

// Create specialized agents
const orderLookupAgent = new Agent({ 
  name: 'Order Lookup Agent',
  instructions: 'You help customers check order status',
  tools: [lookupOrderTool]
});

const supportAgent = new Agent({ 
  name: 'Support Agent',
  instructions: 'You help create support tickets',
  tools: [createTicketTool]
});

// Triage agent with handoffs
const triageAgent = Agent.create({
  name: 'Triage Agent',
  instructions: 'Route to appropriate specialist',
  handoffs: [orderLookupAgent, handoff(supportAgent)]
});
```

**Routing capabilities**:
- Dynamic agent selection based on intent
- Seamless conversation handoff
- Context preservation across agents
- Specialized tool access per agent

**Use cases**: Route to different APIs or integrations based on conversation context, multi-system workflows, vendor-specific operations, customer-specific integration routing

## Quick Start

### Prerequisites
- Prismatic account
- OpenAI API key
- Node.js 18+
- Prism CLI (`npm install -g @prismatic-io/prism`)

### Deploy

```bash
# Clone and install
git clone <repository-url>
cd openai-agent
npm install

# Set environment variable for testing
export OPENAI_API_KEY=sk-proj-...

# Run tests
npm test

# Deploy to Prismatic
prism login
npm run build
npm run import
```

### Configure
1. Navigate to your integration in Prismatic UI
2. Add your OpenAI API key
3. Customize system prompt (optional)
4. Deploy instance and note webhook URL

### Test

```bash
# Test basic chat
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'

# Test API agent
curl -X POST https://your-webhook-url \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Can you get the info about my current user and then find all my related posts?"}
    ]
  }'
```

## Architecture

### Flow Structure
Each flow follows this pattern:
1. Receive webhook payload containing messages
2. Create agent with configuration
3. Process messages through agent
4. Return agent response

### Agent Factory (`src/agents/agentFactory.ts`)
```typescript
export async function createAgent(config?: AgentConfiguration): Promise<Agent> {
  setDefaultOpenAIKey(config.openAIKey);
  
  const agent = new Agent({
    name: "AI Agent",
    instructions: config.systemPrompt,
    tools: config.tools,
  });
  
  return agent;
}
```

### Message Format
```typescript
{
  "messages": [
    {
      "role": "user" | "assistant",
      "content": "message text"
    }
  ]
}
```

## Extending

### Adding a New Flow

1. Create flow file in `src/flows/`:
```typescript
import { flow, util } from "@prismatic-io/spectral";
import { createAgent, runAgent } from "../agents";

export const myCustomFlow = flow({
  name: "My Custom Flow",
  stableKey: "my-custom-flow",
  description: "Description of what this flow does",
  onExecution: async ({ configVars }, params) => {
    // Your implementation
  },
});
```

2. Export from `src/flows/index.ts`:
```typescript
export { myCustomFlow } from "./myCustomFlow";
```

3. Add tests in `src/test/index.test.ts`

### Creating Custom Tools

Tools follow OpenAI's tool interface:

```typescript
import { tool } from '@openai/agents';
import { z } from 'zod';

const myCustomTool = tool({
    name: 'my_tool',
    description: 'What this tool does',
    parameters: z.object({
        input: z.string().describe('Tool input'),
    }),
    async execute({ input }) {
        // Tool implementation
        return `Result: ${input}`;
    },
});
```

### Wrapping Your API as Tools

Transform your REST API endpoints into agent tools:

```typescript
import { tool } from '@openai/agents';
import { z } from 'zod';

const API_BASE_URL = 'https://your-api.com';

const getCustomerData = tool({
    name: 'get_customer_data',
    description: 'Retrieve customer information',
    parameters: z.object({
        customerId: z.string().describe('The customer ID'),
    }),
    async execute({ customerId }) {
        const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch customer: ${response.statusText}`);
        }
        return await response.json();
    },
});

// Export all your API tools
const apiTools = {
    getCustomerData,
    updateCustomer,
    listOrders,
    // ... more tools
};

export default apiTools;
```

### Building Agent Tools

Create specialized agents for specific tasks:

```typescript
// 1. Define specialized agent
const classifier = new Agent({
  name: "Classifier",
  instructions: "Classify text into categories: positive, negative, neutral",
});

// 2. Convert to tool
const classifierTool = classifier.asTool({
  toolName: "classify_sentiment",
  toolDescription: "Classify the sentiment of text",
});

// 3. Use in parent agent
const agent = await createAgent({
  tools: [classifierTool, webSearchTool()]
});
```

## Project Structure

```
openai-agent/
├── src/
│   ├── index.ts                 # Integration entry point
│   ├── configPages.ts           # UI configuration
│   ├── flows/
│   │   ├── basicChat.ts         # Basic conversational flow
│   │   ├── hostedTools.ts       # Flow with OpenAI tools
│   │   ├── agentAsTools.ts      # Agent composition pattern
│   │   ├── apiAgent.ts          # API wrapping demonstration
│   │   ├── humanApprovalFlow.ts # Human-in-the-loop approvals
│   │   └── agentRouting.ts      # Agent handoff routing
│   ├── agents/
│   │   ├── agentFactory.ts      # Agent creation utilities
│   │   └── tools/
│   │       ├── hosted.ts        # OpenAI hosted tools
│   │       ├── agents.ts        # Agent-as-tool examples
│   │       └── api.ts           # API tool definitions
│   └── test/
│       └── index.test.ts        # Flow tests
├── package.json
├── tsconfig.json
└── esbuild.config.js
```

## Configuration

### Required Config Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `SYSTEM_PROMPT`: Instructions for agent behavior

### Agent Configuration Type
```typescript
interface AgentConfiguration {
  systemPrompt: string;
  openAIKey: string;
  tools?: Tool[];
}
```

## Testing

Run unit tests:
```bash
npm test           # Run all tests
npm run test:ui    # Run with Vitest UI
```

Test structure:
```typescript
describe("flow name", () => {
  test("test description", async () => {
    const result = await invokeFlow(flowName, {
      configVars: { /* config */ },
      payload: { /* test payload */ }
    });
    console.log(JSON.stringify(result, null, 2));
  });
});
```

## Development

### Local Development
```bash
npm run lint       # Run ESLint
npm run format     # Format with Prettier
npm run build      # Build for Prismatic
```

### Debugging
Use `runAgentWithDebug` for detailed execution traces:
```typescript
const result = await runAgentWithDebug(agent, input);
```

## Resources

- [OpenAI Agents SDK](https://github.com/openai/agent-sdk)
- [Prismatic Documentation](https://prismatic.io/docs)
- [Prismatic CNI Guide](https://prismatic.io/docs/code-native-integrations)

---

Built with [Prismatic](https://prismatic.io) - The embedded integration platform for B2B software companies