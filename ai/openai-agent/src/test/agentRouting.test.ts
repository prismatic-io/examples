import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { agentRouting } from "../flows/agentRouting";
import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";

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
      const payload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "Where is my order ORD-12345?"
              }
            ]
          },
          contentType: "application/json",
        },
      };

      const { result } = await invokeFlow(agentRouting, {
        configVars,
        payload
      });

      const routingResult = result?.data as { response: string; history: any[] };
      console.log("Order Lookup Routing Result:", routingResult.response, routingResult.history);

      // Verify the response contains order information
      // expect(routingResult.response).toBeDefined();
      // expect(routingResult.response).toContain("ORD-12345");
      // expect(routingResult.response).toContain("shipped");
      // expect(routingResult.response).toContain("Widget Pro X1");
      // expect(routingResult.response).toContain("Widget Pro X2");
      // expect(routingResult.response).toContain("$299.99");
      // expect(routingResult.response).toContain("1Z999AA10123456784");
      // expect(routingResult.response).toContain("Tuesday, November 5th");

      // Verify the routing handoff occurred
      const transferCalls = routingResult.history.filter(
        h => h.type === "function_call" && h.name === "transfer_to_Order_Lookup_Agent"
      );
      expect(transferCalls.length).toBe(1);

      // Verify the order lookup tool was called
      const lookupCalls = routingResult.history.filter(
        h => h.type === "function_call" && h.name === "lookup_order"
      );
      expect(lookupCalls.length).toBe(1);
      expect(lookupCalls[0].arguments).toBe('{"orderId":"ORD-12345"}');
    },
    { timeout: 300000 },
  );

  test(
    "Routes to Support Agent for problem reports",
    async () => {
      const payload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "I have a problem with my order, it arrived damaged. My order number is ORD-12345."
              }
            ]
          },
          contentType: "application/json",
        },
      };

      const { result } = await invokeFlow(agentRouting, {
        configVars,
        payload
      });

      const routingResult = result?.data as { response: string; history: any[] };
      console.log("Support Agent Routing Result:", routingResult.response, routingResult.history);

      // Verify the routing handoff occurred
      const transferCalls = routingResult.history.filter(
        h => h.type === "function_call" && h.name === "transfer_to_Support_Agent"
      );
      expect(transferCalls.length).toBe(1);

      // Verify the create_ticket tool was called
      const ticketCalls = routingResult.history.filter(
        h => h.type === "function_call" && h.name === "create_ticket"
      );
      expect(ticketCalls.length).toBe(1);
      expect(ticketCalls[0].arguments).toContain("damaged");
      expect(ticketCalls[0].arguments).toContain("ORD-12345");
    },
    { timeout: 300000 },
  );


});