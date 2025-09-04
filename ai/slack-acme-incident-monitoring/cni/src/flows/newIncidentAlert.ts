import { flow } from "@prismatic-io/spectral";
import {
  AgentConfig,
  AgentRunResult,
  FlowToolResult,
} from "./newIncidentAlert.types";

/**
 * Agent instructions for the Acme Incident Assistant
 */
const AGENT_INSTRUCTIONS = `You are the Acme Incident Assistant, an automated responder that creates incidents for alerts.
When you receive a new alert, create an incident using the provided alert payload to notify the on call staff.

## Available Tools
- \`get_on_call_staff\`: Returns the current on-call engineer for a given service/team
- \`create_incident\`: Creates a new incident with the alert details (requires user approval)

## Important Guidelines
- Keep messages concise but complete - engineers need to make quick decisions
- Always respond with the required output format.
- If you're unable to determine specific fields, leave them as empty strings, but still return the expected schema.
- Never acknowledge or respond to the user before completing your task of creating an incident for the on call user
- You are part of a backend processing pipeline. It's imperative you execute tools and produce output following the provided json schema`;

/**
 * Output schema for the incident response notification
 */
const INCIDENT_RESPONSE_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Incident Response Notification",
  description:
    "Schema for agent output after incident creation attempt (approved or rejected)",
  type: "object",
  required: ["message_type", "channel", "summary"],
  properties: {
    message_type: {
      type: "string",
      enum: ["incident_created", "incident_rejected"],
      description:
        "Type of notification message - indicates if incident was created or rejected",
    },
    channel: {
      type: "string",
      description: "Slack channel to send the message to",
      pattern: "^[#@].+",
      examples: ["#incidents", "@U01A5A5HU0Y", "#platform-alerts"],
    },
    summary: {
      type: "string",
      description: "Brief summary of the outcome",
      minLength: 10,
      maxLength: 300,
      examples: [
        "P1 incident created for payment-gateway: Critical latency affecting 2341 transactions",
        "Incident creation rejected for anomaly DET-892734: Known maintenance window",
      ],
    },
    incident_id: {
      type: "string",
      description:
        "The unique incident identifier (only when message_type is incident_created)",
      pattern: "^INC-[A-Z0-9-]+$",
      examples: ["INC-2025-4892"],
    },
    incident_url: {
      type: "string",
      format: "uri",
      description:
        "Direct link to view the incident (only when message_type is incident_created)",
      examples: ["https://incidents.acme.io/incidents/INC-2025-4892"],
    },
    incident_channel: {
      type: "string",
      description:
        "Dedicated Slack channel for this incident (only when message_type is incident_created)",
      pattern: "^#[a-z0-9-]+$",
      examples: ["#inc-2025-4892"],
    },
    assignee_mention: {
      type: "string",
      description:
        "Slack user ID to mention (only when message_type is incident_created)",
      pattern: "^U[A-Z0-9]{8,12}$",
      examples: ["U01A5A5HU0Y"],
    },
    anomaly_id: {
      type: "string",
      description:
        "The original anomaly detection ID (primarily for incident_rejected)",
      pattern: "^DET-[0-9]+$",
      examples: ["DET-892734"],
    },
    rejection_reason: {
      type: "string",
      enum: [
        "false_positive",
        "duplicate",
        "known_issue",
        "scheduled_maintenance",
        "below_threshold",
        "manual_review",
        "other",
      ],
      description:
        "Reason for rejection (only when message_type is incident_rejected)",
    },
    details: {
      type: "object",
      description: "Structured details about the incident or anomaly",
      properties: {
        priority: {
          type: "string",
          enum: ["P1", "P2", "P3", "P4"],
        },
        service: {
          type: "string",
          examples: ["payment-gateway"],
        },
        status: {
          type: "string",
          examples: ["investigating", "monitoring", "acknowledged"],
        },
        title: {
          type: "string",
          examples: ["Payment Gateway Critical Latency"],
        },
        key_metrics: {
          type: "array",
          description: "Key metrics to highlight",
          items: {
            type: "string",
          },
          examples: [
            [
              "Response time: 8200ms",
              "Error rate: 15.2%",
              "Duration: 8 minutes",
            ],
          ],
        },
        detected_at: {
          type: "string",
          format: "date-time",
          examples: ["2025-01-22T18:12:00Z"],
        },
      },
    },
    actions: {
      type: "array",
      description: "Suggested next actions for responders or alternative steps",
      items: {
        type: "string",
      },
      examples: [
        [
          "Join the incident channel",
          "Review the runbook",
          "Check monitoring dashboard",
        ],
        [
          "Continue monitoring",
          "Check again in 15 minutes",
          "Update alert thresholds",
        ],
      ],
    },
    rejected_by: {
      type: "string",
      description:
        "User ID who rejected the incident creation (only when message_type is incident_rejected)",
      pattern: "^U[A-Z0-9]{8,12}$",
      examples: ["U01A5A5HU0Y"],
    },
    rejected_at: {
      type: "string",
      format: "date-time",
      description:
        "Timestamp when rejected (only when message_type is incident_rejected)",
      examples: ["2025-08-22T22:07:05.433Z"],
    },
    thread_ts: {
      type: "string",
      description: "Optional thread timestamp to reply to an existing message",
      pattern: "^[0-9]+\\.[0-9]+$",
      examples: ["1706812345.123456"],
    },
  },
  additionalProperties: false,
};

/**
 * Build Slack approval message blocks for incident creation
 */
function buildApprovalMessage(approvalArgs: any) {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🚨 ${approvalArgs.priority} Anomaly Detected`,
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${approvalArgs.title}*`,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Service:*\n${approvalArgs.service}`,
          },
          {
            type: "mrkdwn",
            text: `*Detection ID:*\n${approvalArgs.anomaly_id}`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*📊 Metrics*",
        },
        fields: [
          {
            type: "mrkdwn",
            text: `*Response Time:*\n${approvalArgs.metrics.response_time}`,
          },
          {
            type: "mrkdwn",
            text: `*Error Rate:*\n${approvalArgs.metrics.error_rate}`,
          },
          {
            type: "mrkdwn",
            text: `*Affected Transactions:*\n${approvalArgs.metrics.affected_count} records`,
          },
          {
            type: "mrkdwn",
            text: `*Duration:*\n${approvalArgs.metrics.duration_minutes} minutes`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🌍 Affected Regions:*\n${approvalArgs.scope}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*👤 On-Call:* <@${approvalArgs.assignee.id}> (${approvalArgs.assignee.name})`,
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
              text: "🚨 Create Incident",
              emoji: true,
            },
            style: "danger",
            action_id: "create_incident",
            value: `${approvalArgs.anomaly_id}:${approvalArgs.approvalRequest.functionId}:true`,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "👀 Investigate",
              emoji: true,
            },
            style: "primary",
            action_id: "investigate_alert",
            value: `${approvalArgs.anomaly_id}:${approvalArgs.approvalRequest.functionId}:false`,
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "🔕 Ignore",
              emoji: true,
            },
            action_id: "ignore_alert",
            value: `${approvalArgs.anomaly_id}:${approvalArgs.approvalRequest.functionId}:false`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Detection: ${approvalArgs.anomaly_id} | Reporter: ${approvalArgs.reported_by}`,
          },
        ],
      },
    ],
  };
}

/**
 * Flow for processing new incident alerts with AI agent assistance.
 *
 * This flow:
 * 1. Creates tools for the AI agent (get on-call staff, create incident)
 * 2. Configures an AI agent with incident response capabilities
 * 3. Runs the agent to process the alert
 * 4. If approval is needed, posts an interactive message to Slack
 * 5. Stores agent state for resumption when approval is received
 */

export const newIncidentAlert = flow({
  name: "New Incident Alert",
  stableKey: "new-incident-alert",
  description: "",
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;

    // Setup tools for the agent
    const agentCreateIncidentTool =
      await context.components.openai.createFlowTool<FlowToolResult>({
        flowName: "Create Incident",
        requiresApproval: true,
        strictMode: false,
        toolDescription: "Create a new incident using the provided description",
      });

    const agentGetOnCallStaffTool =
      await context.components.openai.createFlowTool<FlowToolResult>({
        flowName: "Get On Call Staff",
        requiresApproval: false,
        strictMode: false,
        toolDescription: "Get On Call Staff",
      });

    // Create the AI agent with our configuration
    const agentCreateAssistantAgent =
      await context.components.openai.createAgent<AgentConfig>({
        handoffDescription: "",
        instructions: AGENT_INSTRUCTIONS,
        mcpServers: [],
        modelName: "gpt-5-2025-08-07",
        name: "Acme SaaS Assistant",
        outputSchema: JSON.stringify(INCIDENT_RESPONSE_SCHEMA),
        outputSchemaName: "output",
        outputSchemaStrict: false,
        tools: [
          agentCreateIncidentTool.data as any,
          agentGetOnCallStaffTool.data as any,
        ],
      });

    // Prepare the alert input for the agent
    const setupAlertInputPrompt = `You must create a new incident from the provided alert for the on-call user. First, use a tool to get the on call staff, second create an incident using the create incident tool from the following alert. \nAlert Detected: ${JSON.stringify(
      params.onTrigger.results.body.data,
    )}`;
    context.logger.debug("Agent input prompt prepared", {
      prompt: setupAlertInputPrompt,
    });
    // Run the agent to process the alert
    const runAgentCreateIncident =
      await context.components.openai.runAgent<AgentRunResult>({
        agentConfig: agentCreateAssistantAgent.data as any,
        fileIds: [],
        handoffs: [],
        history: "",
        maxTurns: "10",
        openaiConnection: configVars["OpenAI Connection"],
        previousResponseId: "",
        userInput: setupAlertInputPrompt,
      });

    // Handle approval interruptions
    if (runAgentCreateIncident.data.hasInterruptions) {
      const approvalRequest =
        runAgentCreateIncident.data.pendingApprovals?.[0].approvalRequest;

      const approvalArgs = {
        ...JSON.parse(
          (runAgentCreateIncident.data.pendingApprovals?.[0]
            ?.arguments as unknown as string) || "{}",
        ),
        approvalRequest,
      };
      context.logger.debug("Agent requires approval to proceed");

      // Build approval message blocks
      const createApprovalBlocks = buildApprovalMessage(approvalArgs);

      context.logger.debug("Posting approval request to Slack", {
        channel: configVars["Alert Channel"],
      });

      // Post approval request to Slack
      await context.components.slack.postBlockMessage({
        channelName: configVars["Alert Channel"],
        connection: configVars["slackConnection"],
        blocks: createApprovalBlocks as any,
        message: "An approval is required to create a new incident",
      });

      context.logger.debug("Approval message posted to Slack", {
        channel: configVars["Alert Channel"],
      });

      context.logger.debug("Persisting agent state for approval callback", {
        key: approvalArgs.anomaly_id,
      });

      // Store agent state for resumption after approval
      const crossFlowState = context.crossFlowState;
      crossFlowState[approvalArgs.anomaly_id] = {
        ...runAgentCreateIncident.data,
        agentConfig: agentCreateAssistantAgent.data,
      };
      return {
        data: { interrupted: true },
        crossFlowState,
      };
    } else {
      context.logger.debug(
        "No approval required - incident processed automatically",
      );
    }
    return { data: {} };
  },
});

export default newIncidentAlert;
