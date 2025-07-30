import { flow, util } from "@prismatic-io/spectral";
import { Agent, handoff, run, tool, setDefaultOpenAIKey } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { AgentInputItem } from "@openai/agents";
import { z } from "zod";
import { parseFlowInput, buildFlowOutput } from "./utils/flowHelpers";
import { AgentState } from "../agents/state";

const mockOrders: Record<string, any> = {
  "ORD-12345": {
    status: "shipped",
    items: ["Widget Pro X1", "Widget Pro X2"],
    tracking: "1Z999AA10123456784",
    deliveryDate: "Tuesday, November 5th",
    total: "$299.99",
  },
  "ORD-67890": {
    status: "processing",
    items: ["Enterprise Widget Suite"],
    tracking: null,
    deliveryDate: "Expected: November 8th",
    total: "$1,299.00",
  },
  "ORD-11111": {
    status: "delivered",
    items: ["Widget Basic"],
    tracking: "1Z999BB20234567891",
    deliveryDate: "Delivered: October 28th",
    total: "$49.99",
  },
};

// Tool definitions
const lookupOrderTool = tool({
  name: "lookup_order",
  description: "Look up order information by order ID",
  parameters: z.object({
    orderId: z.string().describe("The order ID to look up (e.g., ORD-12345)"),
  }),
  execute: async ({ orderId }) => {
    const order = mockOrders[orderId];
    if (!order) {
      return `Order ${orderId} not found. Please check your order ID.`;
    }

    return `Order ${orderId}:
- Status: ${order.status}
- Items: ${order.items.join(", ")}
- Total: ${order.total}
- ${order.tracking ? `Tracking: ${order.tracking}` : "Tracking not yet available"}
- ${order.deliveryDate}`;
  },
});

const createTicketTool = tool({
  name: "create_ticket",
  description: "Create a support ticket for customer issues",
  parameters: z.object({
    issue: z.string().describe("Description of the customer issue"),
    orderId: z.string().nullable().describe("Related order ID if applicable"),
  }),
  execute: async ({ issue, orderId }) => {
    const ticketId = `TICKET-${Math.floor(Math.random() * 10000)}`;
    const response = `Support ticket created successfully!
- Ticket ID: ${ticketId}
- Issue: ${issue}
${orderId ? `- Related Order: ${orderId}` : ""}
- Status: Open
- Expected Response: Within 24 hours

You'll receive an email confirmation shortly.`;
    return response;
  },
});

export const agentRouting = flow({
  name: "Agent Routing",
  stableKey: "agent-routing",
  description:
    "Demonstrates agent handoff pattern for routing customer inquiries to specialized agents",
  onTrigger: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  onExecution: async ({ configVars, executionId }, params) => {
    const openaiConnection = util.types.toString(
      configVars.OPENAI_API_KEY.fields.apiKey,
    );

    setDefaultOpenAIKey(openaiConnection);

    const input = parseFlowInput(params.onTrigger.results.body.data);

    if (!input.message) {
      throw new Error("Message is required for agent routing");
    }

    // Specialized agents
    const orderLookupAgent = new Agent({
      name: "Order Lookup Agent",
      instructions: `${RECOMMENDED_PROMPT_PREFIX}
      You help customers check their order status.
      When asked about an order:
      1. Use the lookup_order tool to get order details
      2. Present the information in a friendly, helpful way`,
      tools: [lookupOrderTool],
    });

    const supportAgent = new Agent({
      name: "Support Agent",
      instructions: `${RECOMMENDED_PROMPT_PREFIX}
      Remember to always use the tool to help the customer.
      1. Use the create_ticket tool to create a support ticket
      2. Provide the ticket details and set expectations for response time

      Be empathetic and professional.`,
      tools: [createTicketTool],
    });

    // Triage agent with handoffs using Agent.create
    const triageAgent = Agent.create({
      name: "Triage Agent",
      instructions: `${RECOMMENDED_PROMPT_PREFIX}
      You are a customer service routing agent. Your job is to understand what the customer needs and route them to the right specialist.

      Routing rules:
      - For order status questions, tracking info, or delivery inquiries -> transfer to Order Lookup Agent
      - For problems with orders, issues, complaints, returns, or refunds -> transfer to Support Agent

      Important:
      - Do NOT try to answer questions yourself`,
      handoffs: [orderLookupAgent, handoff(supportAgent)],
    });

    // Build message history for the agent
    const messages: AgentInputItem[] = [
      { role: "user", content: input.message },
    ];

    // Run the triage agent with the incoming messages
    const result = await run(triageAgent, messages, {});

    // Create agent state to maintain consistency with other flows
    const agentState: AgentState = {
      conversationId: input.conversationId,
      finalOutput: result.finalOutput || undefined,
      history: result.history,
      metadata: {
        lastExecutionId: executionId,
        timestamp: Date.now(),
      },
    };

    return {
      data: buildFlowOutput(agentState, executionId),
    };
  },
});

export default agentRouting;
