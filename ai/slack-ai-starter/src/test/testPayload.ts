import { TriggerPayload } from "@prismatic-io/spectral";
import { defaultTriggerPayload } from "@prismatic-io/spectral/dist/testing";

const testSlackEvent: TriggerPayload = {
  ...defaultTriggerPayload(),
  headers: {
    Accept: "*/*",
    "Accept-Encoding": "gzip,deflate",
    "Content-Type": "application/json",
    Host: "hooks.prismatic.io",
    "User-Agent": "Slackbot 1.0 (+https://api.slack.com/robots)",
    "X-Amz-Cf-Id": "kjQnZ-idwr00g-v6TyC4F7_Qi8DZTte_uF-JeyKyVm1T65o4FSB5qw==",
    "X-Amzn-Trace-Id": "Root=1-688413df-1982147510466d1c7e5d8211",
    "X-Forwarded-For": "50.16.79.71, 15.158.50.209",
    "X-Slack-Request-Timestamp": "1753486303",
    "X-Slack-Signature":
      "v0=5b874d05f4ddc21efd14b85a97b8a84d8d20e8c4e16a24fa4c988ea23010b9ef",
  },
  body: {
    data: {
      token: "cGTmn7nF6arTCVVt8zkTIXdt",
      team_id: "TH0GJM0M8",
      context_team_id: "TH0GJM0M8",
      context_enterprise_id: null,
      api_app_id: "A067BPMK03Y",
      event: {
        user: "U01A5A5HU0Y",
        type: "message",
        ts: "1753486302.567149",
        client_msg_id: "2c2ed6b3-f73f-4280-b05e-8b9ff66434b3",
        text: "What can you help me with",
        team: "TH0GJM0M8",
        thread_ts: "1753486051.991489",
        parent_user_id: "U067X4BARFB",
        blocks: [
          {
            type: "rich_text",
            block_id: "CSkzJ",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "What can you help me with",
                  },
                ],
              },
            ],
          },
        ],
        channel: "D067JF3Q2BU",
        event_ts: "1753486302.567149",
        channel_type: "im",
      },
      type: "event_callback",
      event_id: "Ev097ZD7KMLZ",
      event_time: 1753486302,
      authorizations: [
        {
          enterprise_id: null,
          team_id: "TH0GJM0M8",
          user_id: "U067X4BARFB",
          is_bot: true,
          is_enterprise_install: false,
        },
      ],
      is_ext_shared_channel: false,
      event_context:
        "4-eyJldCI6Im1lc3NhZ2UiLCJ0aWQiOiJUSDBHSk0wTTgiLCJhaWQiOiJBMDY3QlBNSzAzWSIsImNpZCI6IkQwNjdKRjNRMkJVIn0",
    },
    contentType: "application/json",
  },
};

export default testSlackEvent;
