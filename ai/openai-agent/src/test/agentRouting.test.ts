import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { agentRouting } from "../flows/agentRouting";
import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
import { FlowOutput } from "../types/flow.types";

describe("agentRouting", () => {
  const configVars = {
    OPENAI_API_KEY: {
      fields: { apiKey: process.env.OPENAI_API_KEY || "" },
    },
    SYSTEM_PROMPT: "You are a helpful assistant.",
  };

  test(
    "Routes to Order Lookup Agent for order status inquiries",
    async () => {
      const conversationId = "test-routing-conversation";
      const payload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            conversationId,
            message: "Where is my order ORD-12345?",
          },
          contentType: "application/json",
        },
      };

      const { result } = await invokeFlow(agentRouting, {
        configVars,
        payload,
      });

      const flowResult = result?.data as FlowOutput;

      // Verify the routing handoff occurred
      const transferCalls = flowResult.agentState?.history.filter(
        (h) =>
          h.type === "function_call" &&
          h.name === "transfer_to_Order_Lookup_Agent",
      );
      expect(transferCalls?.length).toBe(1);

      // Verify the order lookup tool was called
      const lookupCalls = flowResult.agentState?.history.filter(
        (h) => h.type === "function_call" && h.name === "lookup_order",
      );
      expect(lookupCalls?.length).toBe(1);
    },
    { timeout: 300000 },
  );

});
