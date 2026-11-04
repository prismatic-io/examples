import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";

const testPayload: TriggerPayload = {
  ...defaultTriggerPayload(),
  body: {
    data: {
      conversationId: "test-conversation",
      message: "What is the capital of France?",
    },
    contentType: "application/json",
  },
};

export default testPayload;
