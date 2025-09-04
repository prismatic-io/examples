import { ActionContext } from "@prismatic-io/spectral";
import type { IncidentResponseNotification } from "../flows/newIncidentAlert.types";

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  elements?: Array<{
    type: string;
    text?:
      | {
          type: string;
          text: string;
          emoji?: boolean;
        }
      | string;
    url?: string;
    style?: string;
    action_id?: string;
    value?: string;
  }>;
}

/**
 * Build message blocks for a successfully created incident
 */
export function buildIncidentCreatedMessage(
  finalOutput: IncidentResponseNotification,
): SlackBlock[] {
  const messageBlocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `✅ *Incident Created*\n${finalOutput.summary}`,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Incident ID:*\n${finalOutput.incident_id}`,
        },
        {
          type: "mrkdwn",
          text: `*Channel:*\n${finalOutput.incident_channel}`,
        },
      ],
    },
  ];

  if (finalOutput.incident_url) {
    messageBlocks.push({
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View Incident",
          },
          url: finalOutput.incident_url,
        },
      ],
    });
  }

  return messageBlocks;
}

/**
 * Build message blocks for a rejected/handled incident
 */
export function buildIncidentRejectedMessage(
  finalOutput: IncidentResponseNotification,
): SlackBlock[] {
  const messageBlocks: SlackBlock[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `ℹ️ *Alert Handled*\n${finalOutput.summary}`,
      },
    },
  ];

  if (finalOutput.rejection_reason) {
    messageBlocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Reason: ${finalOutput.rejection_reason}`,
        },
      ],
    });
  }

  return messageBlocks;
}

/**
 * Build message blocks based on the incident response type
 */
export function buildIncidentResultMessage(
  finalOutput: IncidentResponseNotification,
): SlackBlock[] {
  if (finalOutput.message_type === "incident_created") {
    return buildIncidentCreatedMessage(finalOutput);
  } else {
    return buildIncidentRejectedMessage(finalOutput);
  }
}

/**
 * Post incident result message to Slack
 */
export async function postIncidentResult(
  context: ActionContext,
  finalOutput: IncidentResponseNotification,
): Promise<void> {
  const messageBlocks = buildIncidentResultMessage(finalOutput);

  await context.components.slack.postBlockMessage({
    channelName: context.configVars["Alert Channel"],
    connection: context.configVars["slackConnection"],
    blocks: messageBlocks as any,
    message: finalOutput.summary,
    messageId: finalOutput.thread_ts,
  });

  console.log("Result posted to Slack");
}
