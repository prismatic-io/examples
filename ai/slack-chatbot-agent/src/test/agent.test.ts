import { describe, test } from "vitest";
import { setupAgent } from "../agents/setup";

describe("Agent Interruption Tests", () => {
  test(
    "should not trigger interruption for normal message",
    async () => {
      // Setup agent without approval tools
      const agent = await setupAgent({
        openAIKey: process.env.OPENAI_API_KEY!,
        systemPrompt: "You are a helpful assistant.",
        includeApprovalTools: true,
      });

      // Run agent with normal request
      const result = await agent.run(
        "What is the weather today?",
        "test-conversation",
      );
      console.log(result.finalOutput);

      const result2 = await agent.run(
        "can you deploy v1 to prod?",
        "test-conversation",
        "test-execution-id-1",
      );
      console.log("Needs Approval: ", result2.needsApproval);

      const res3 = await agent.runWithDecision(
        "test-conversation",
        "test-execution-id-1",
        true,
      );
      console.log(res3.finalOutput);
    },
    { timeout: 300000 },
  );
});
