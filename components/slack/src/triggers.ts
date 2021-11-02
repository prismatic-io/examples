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
});

export default { webhook };
