import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";
export const testSlackEvent: TriggerPayload = {
  ...defaultTriggerPayload(),

  headers: {
    Accept: "*/*",
    "Accept-Encoding": "gzip,deflate",
    "Content-Type": "application/json",
    Host: "hooks.prismatic.io",
    "User-Agent": "Slackbot 1.0 (+https://api.slack.com/robots)",
    "X-Slack-Request-Timestamp": "1755126747",
    "X-Slack-Signature":
      "v0=f9c7d91f850a10d7f927f72f236c54eebdf10d5eab4428e012e0c0111bb9bff2",
  },
  body: {
    data: {
      token: "xoxb-123456789012-1234567890123-1234567890123-abcdefj",
      team_id: "T0001",
      context_team_id: "T0001",
      context_enterprise_id: null,
      api_app_id: "A067BPMK03Y",
      event: {
        user: "U01A5A5HU0Y",
        type: "message",
        ts: "1755126747.013359",
        client_msg_id: "3e4c24c9-3ee8-4c5c-a311-7031081c516b",
        text: "What is 2+2",
        team: "T0001",
        thread_ts: "1755126668.411939",
        parent_user_id: "01A5A5HU0",
        blocks: [
          {
            type: "rich_text",
            block_id: "vkK0W",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "What is 2+2",
                  },
                ],
              },
            ],
          },
        ],
        channel: "D01A5A5HU0",
        event_ts: "1755126747.013359",
        channel_type: "im",
      },
      type: "event_callback",
      event_id: "Ev09AA882QJW",
      event_time: 1755126747,
      authorizations: [
        {
          enterprise_id: null,
          team_id: "T0001",
          user_id: "01A5A5HU0",
          is_bot: true,
          is_enterprise_install: false,
        },
      ],
      is_ext_shared_channel: false,
      event_context: "4-im.D01A5A5HU0",
    },
    contentType: "application/json",
  },
  pathFragment: "",
  webhookUrls: {
    "Slack Message Handler":
      "https://hooks.prismatic.io/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjgzZWM5ZTI0LWI1NjctNDI2ZC1iYmFiLWY1Y2M3OTZjZWU0Nw==",
  },
  webhookApiKeys: {
    "Slack Message Handler": [],
  },
  invokeUrl:
    "https://hooks.prismatic.io/trigger/SW5zdGFuY2VGbG93Q29uZmlnOjgzZWM5ZTI0LWI1NjctNDI2ZC1iYmFiLWY1Y2M3OTZjZWU0Nw==",
  executionId:
    "SW5zdGFuY2VFeGVjdXRpb25SZXN1bHQ6ZjRmN2U1MWQtOWZlOS00MThkLTk3NTQtMzVhNDgwMzMzZjcy",
  customer: {
    id: "testCustomerId",
    name: "Test Customer",
    externalId: "testCustomerExternalId",
  },
  instance: {
    id: "SW5zdGFuY2U6ZDliODhiYmItZDkyOC00M2Q1LWJiODUtY2Q4NzJmYWE3YjU0",
    name: "Slack Agent",
  },
  user: {
    id: "testUserId",
    email: "testUserEmail@example.com",
    name: "Test User",
    externalId: "testUserExternalId",
  },
  integration: {
    id: "SW50ZWdyYXRpb246ZDA5M2YzOTgtNWMwOS00MmFmLTk2NDktMWRiYWNkMjQyNWVk",
    name: "Slack Agent",
    versionSequenceId: "69100330-9227-46b7-b7f1-7dc5812a2f1d",
    externalVersion: "",
  },
  flow: {
    id: "SW50ZWdyYXRpb25GbG93OmMwN2ExZjFiLWNiYTctNGYxMC05ZjdhLTI1ODNiYzUxNzNhNg==",
    name: "Slack Message Handler",
  },
  startedAt: "2025-08-13 23:12:28.01904+00",
  globalDebug: false,
};

export default testSlackEvent;
