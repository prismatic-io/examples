jest.mock("@slack/webhook", () => {
  return {
    IncomingWebhook: jest.fn(() => ({
      send: jest.fn().mockResolvedValue("Mock message sent successfully."),
    })),
  };
});

import { postSlackMessageAction } from ".";
import { PerformDataReturn } from "@prismatic-io/spectral";
import { invoke } from "@prismatic-io/spectral/dist/testing";

describe("postSlackMessage", () => {
  test("calls webhook send", async () => {
    const { result } = await invoke<PerformDataReturn>(postSlackMessageAction, {
      message: "foo",
      webhookUrl: "https://example.com",
    });
    expect(result.data).toStrictEqual("Mock message sent successfully.");
  });
});
