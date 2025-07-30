import { invokeFlow } from "@prismatic-io/spectral/dist/testing";
import { humanApprovalFlow } from "../flows/humanApprovalFlow";
import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
import type { ApprovalResult, PendingApproval } from "../agents";

describe("humanApprovalFlow", () => {
  const configVars = {
    OPENAI_API_KEY: {
      fields: { apiKey: process.env.OPENAI_API_KEY || "" },
    },
    SYSTEM_PROMPT: "You are a helpful assistant.",
  };

  test(
    "Step 1: Initial request triggers approval for create_post",
    async () => {
      const initialPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "Create a new post with the title 'My Test Post' and body 'This is a test post created with approval'"
              }
            ]
          },
          contentType: "application/json",
        },
      };

      const { result } = await invokeFlow(humanApprovalFlow, {
        configVars,
        payload: initialPayload
      });

      const approvalResult = result?.data as ApprovalResult;
      console.log("Step 1 Result:", JSON.stringify(approvalResult, null, 2));

      // // Verify the response requires approval
      expect(approvalResult.state).toBeDefined();
      expect(approvalResult.pendingApprovals).toBeDefined();
      expect(approvalResult.pendingApprovals!.length).toBeGreaterThan(0);

      // // Check that create_post is in the pending approvals
      const createPostApproval = approvalResult.pendingApprovals!.find(
        (approval: PendingApproval) => approval.toolName === 'create_post'
      );
      expect(createPostApproval).toBeDefined();
      expect(createPostApproval?.callId).toBeDefined();

      console.log("Pending approval for:", createPostApproval?.toolName);
      console.log("Call ID:", createPostApproval?.callId);
      console.log("Arguments:", createPostApproval?.arguments);
    },
    { timeout: 300000 },
  );

  test(
    "Step 2: Resume with approval and complete the task",
    async () => {
      // First, get the initial state by running the first request
      const initialPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "Create a new post with the title 'Approved Post' and body 'This post was approved by the user'"
              }
            ]
          },
          contentType: "application/json",
        },
      };

      const { result: initialResult } = await invokeFlow(humanApprovalFlow, {
        configVars,
        payload: initialPayload
      });

      const initialApprovalResult = initialResult?.data as ApprovalResult;
      console.log("Initial result - needs approval:", initialApprovalResult.needsApproval);

      // Extract the state and pending approvals
      const { state, pendingApprovals } = initialApprovalResult;

      // Prepare approval payload
      const approvalPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "Create a new post with the title 'Approved Post' and body 'This post was approved by the user'"
              }
            ],
            state: state,
            toolApprovals: pendingApprovals!.map((approval: PendingApproval) => ({
              callId: approval.callId,
              decision: 'approved' as const
            }))
          },
          contentType: "application/json",
        },
      };

      const { result: finalResult } = await invokeFlow(humanApprovalFlow, {
        configVars,
        payload: approvalPayload
      });

      const finalApprovalResult = finalResult?.data as ApprovalResult;
      console.log("Step 2 Result:", JSON.stringify(finalApprovalResult, null, 2));

      // Verify the task completed without needing more approvals
      expect(finalApprovalResult.needsApproval).toBe(false);
      expect(finalApprovalResult.response).toBeDefined();

      console.log("Final response:", finalApprovalResult.response);
    },
    { timeout: 300000 },
  );

  test(
    "Step 3: Test rejection scenario",
    async () => {
      // First, get the initial state
      const initialPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "Update post with ID 1 to have a new title of 'Rejection test' and body of 'This is a test post created with approval'"
              }
            ]
          },
          contentType: "application/json",
        },
      };

      const { result: initialResult } = await invokeFlow(humanApprovalFlow, {
        configVars,
        payload: initialPayload
      });

      const rejectionInitialResult = initialResult?.data as ApprovalResult;
      console.log("Initial result for rejection test:", rejectionInitialResult.pendingApprovals);

      const { state, pendingApprovals } = rejectionInitialResult;

      // Prepare rejection payload
      const rejectionPayload: TriggerPayload = {
        ...defaultTriggerPayload(),
        body: {
          data: {
            messages: [
              {
                role: "user",
                content: "Update post with ID 1 to have a new title and body"
              }
            ],
            state: state,
            toolApprovals: pendingApprovals!.map((approval: PendingApproval) => ({
              callId: approval.callId,
              decision: 'rejected' as const,
              reason: 'User denied permission to update the post'
            }))
          },
          contentType: "application/json",
        },
      };

      const { result: finalResult } = await invokeFlow(humanApprovalFlow, {
        configVars,
        payload: rejectionPayload
      });

      const rejectionFinalResult = finalResult?.data as ApprovalResult;
      console.log("Rejection Result:", JSON.stringify(rejectionFinalResult, null, 2));

      // Verify the task completed with rejection
      expect(rejectionFinalResult.needsApproval).toBe(false);
      expect(rejectionFinalResult.response).toBeDefined();

      console.log("Response after rejection:", rejectionFinalResult.response);
    },
    { timeout: 300000 },
  );
});