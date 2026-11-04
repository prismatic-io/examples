import { Block, KnownBlock } from "@slack/web-api";

/**
 * Create Slack blocks for tool approval request
 */
export function createApprovalBlocks(
  toolName: string,
  args: any,
  executionId: string,
): (Block | KnownBlock)[] {
  const formattedArgs = JSON.stringify(args, null, 2);

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🔒 Tool Approval Required",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `The AI assistant wants to execute the following tool:\n\n*Tool:* \`${toolName}\``,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Arguments:*\n\`\`\`${formattedArgs}\`\`\``,
      },
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "✅ Approve",
            emoji: true,
          },
          style: "primary",
          action_id: `approve_tool_${executionId}`,
          value: executionId,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "❌ Deny",
            emoji: true,
          },
          style: "danger",
          action_id: `deny_tool_${executionId}`,
          value: executionId,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Execution ID: \`${executionId}\``,
        },
      ],
    },
  ];
}

/**
 * Create blocks for showing approval decision
 */
export function createDecisionBlocks(
  toolName: string,
  args: any,
  approved: boolean,
  userId: string,
): (Block | KnownBlock)[] {
  const formattedArgs = JSON.stringify(args, null, 2);
  const emoji = approved ? "✅" : "❌";
  const status = approved ? "APPROVED" : "DENIED";
  const color = approved ? "#36a64f" : "#ff0000";

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} Tool ${status}`,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<@${userId}> ${approved ? "approved" : "denied"} the tool execution`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Tool:* \`${toolName}\`\n*Arguments:*\n\`\`\`${formattedArgs}\`\`\``,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Decision made at <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|${new Date().toISOString()}>`,
        },
      ],
    },
  ];
}
