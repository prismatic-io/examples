import { defaultTriggerPayload } from "@prismatic-io/spectral/testing";
import { afterEach, describe, expect, it, vi } from "vitest";
import { eventHandler } from "./flows/eventHandler";
import { ack, computeSignature } from "./slack/acknowledge";
import { createApprovalBlocks, createDecisionBlocks } from "./slack/blocks/approvalBlocks";

const signingSecret = "test-signing-secret";

const buildSignedPayload = (body: Record<string, unknown>, secret = signingSecret) => {
  const rawBody = JSON.stringify(body);
  const timestamp = Math.floor(Date.now() / 1000);
  const basePayload = defaultTriggerPayload();
  return {
    ...basePayload,
    headers: {
      ...basePayload.headers,
      "X-Slack-Request-Timestamp": `${timestamp}`,
      "X-Slack-Signature": computeSignature(rawBody, secret, timestamp),
    } as Record<string, string>,
    rawBody: { data: rawBody },
    body: { data: body },
  };
};

describe("integration definition", () => {
  it("exposes the Slack message handler flow", () => {
    expect(eventHandler.stableKey).toBe("slack-event-handler");
  });
});

describe("ack", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the challenge for Slack URL verification requests", () => {
    vi.stubEnv("NODE_ENV", "production");
    const payload = buildSignedPayload({ type: "url_verification", challenge: "abc123" });
    const { response, isRetry } = ack(payload, signingSecret);
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("abc123");
    expect(isRetry).toBe(false);
  });

  it("rejects requests with an invalid signature", () => {
    vi.stubEnv("NODE_ENV", "production");
    const payload = buildSignedPayload({ type: "event_callback" }, "wrong-secret");
    expect(() => ack(payload, signingSecret)).toThrow(/validating message signature/);
  });

  it("detects Slack retries", () => {
    vi.stubEnv("NODE_ENV", "production");
    const payload = buildSignedPayload({ type: "event_callback" });
    payload.headers["X-Slack-Retry-Num"] = "2";
    payload.headers["X-Slack-Retry-Reason"] = "http_timeout";
    const result = ack(payload, signingSecret);
    expect(result.isRetry).toBe(true);
    expect(result.retryNum).toBe(2);
    expect(result.retryReason).toBe("http_timeout");
  });
});

describe("approval blocks", () => {
  it("renders approve and deny buttons keyed by execution ID", () => {
    const blocks = createApprovalBlocks("create_post", { title: "Hello" }, "exec-1");
    const actions = blocks.find((block) => block.type === "actions") as any;
    expect(actions.elements.map((e: any) => e.action_id)).toEqual([
      "approve_tool_exec-1",
      "deny_tool_exec-1",
    ]);
  });

  it("renders the approval decision", () => {
    const blocks = createDecisionBlocks("create_post", { title: "Hello" }, true, "U123");
    expect(JSON.stringify(blocks)).toContain("<@U123> approved the tool execution");
  });
});
