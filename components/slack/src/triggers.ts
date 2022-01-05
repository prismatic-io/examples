import { trigger } from "@prismatic-io/spectral";

export const webhook = trigger({
  display: {
    label: "Webhook",
    description: "Trigger for handling webhooks from Slack",
  },
  perform: async (context, payload) => {
    return Promise.resolve({
      payload,
    });
  },
  inputs: {},
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
  examplePayload: {
    payload: {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        "User-Agent": "Slackbot 1.0 (+https://api.slack.com/robots)",
        Host: "hooks.example.prismatic.io",
      },
      body: {
        data: {},
      },
      rawBody: { data: Buffer.from("Example") },
      queryParameters: {},
      webhookUrls: {
        "Flow 1":
          "https://hooks.example.prismatic.io/trigger/EXAMPLEGbG93Q29uZmlnOmRlNmNmNDMyLTliNWMtN0005NDMxLTRmYzA4ZjViODgxOA==",
      },
      webhookApiKeys: {
        "Flow 1": ["abc-123"],
      },
      customer: {
        externalId: "customer-example-external-id",
        name: "John Doe",
      },
    },
  },
});

export default { webhook };
