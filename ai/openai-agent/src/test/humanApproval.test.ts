import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { humanApprovalFlow } from "../flows/humanApprovalFlow";
import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
import { FlowOutput } from "../types/flow.types";
describe("humanApprovalFlow", () => {
  const configVars = {
    OPENAI_API_KEY: {
      fields: { apiKey: process.env.OPENAI_API_KEY || "" },
    },
    SYSTEM_PROMPT: "You are a helpful assistant.",
  };

  test("Step 1: Initial request triggers approval for create_post", async () => {
    const conversationId = "test-approval-conversation";
    const initialPayload: TriggerPayload = {
      ...defaultTriggerPayload(),
      body: {
        data: {
          conversationId,
          message:
            "Create a new post with the title 'My Test Post' and body 'This is a test post created with approval'",
        },
        contentType: "application/json",
      },
    };

    const { result } = await invokeFlow(humanApprovalFlow, {
      configVars,
      payload: initialPayload,
    });
    const flowResult = result?.data as FlowOutput;
    if (flowResult.agentState?.pendingApproval) {
      console.log(
        "Approving Tool: ",
        JSON.stringify(flowResult.agentState.pendingApproval, null, 2),
      );
      const { result: approvalResult } = await invokeFlow(humanApprovalFlow, {
        configVars,
        payload: {
          ...defaultTriggerPayload(),
          body: {
            data: {
              conversationId,
              message: null,
              previousExecutionId: flowResult.executionId,
              approval: {
                approved: true,
              },
            },
            contentType: "application/json",
          },
        },
      });
      const approvalState = (approvalResult?.data as FlowOutput).agentState;
      console.log(approvalState?.finalOutput);
    }
  });
});
