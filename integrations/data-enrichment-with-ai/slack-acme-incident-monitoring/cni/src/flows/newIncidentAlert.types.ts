// Type definitions for newIncidentAlert flow

// Tool creation result types
export interface FlowToolResult {
  data: {
    results: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
      [key: string]: unknown;
    };
  };
}

// Agent configuration types
export interface AgentConfig {
  data: {
    agent: {
      id: string;
      name: string;
      modelName: string;
      instructions: string;
      tools: Array<{
        name: string;
        description: string;
        parameters: Record<string, unknown>;
      }>;
      outputSchema?: string;
      outputSchemaName?: string;
      outputSchemaStrict?: boolean;
      mcpServers?: Array<unknown>;
      handoffDescription?: string;
    };
  };
}

// Agent run result types
export interface AgentRunResult {
  data: {
    hasInterruptions: boolean;
    finalOutput: IncidentResponseNotification;
    pendingApprovals?: Array<PendingApproval>;
    [key: string]: unknown;
  };
  results: {
    pendingApprovals?: Array<PendingApproval>;
    [key: string]: unknown;
  };
}

export interface PendingApproval {
  approvalRequest: {
    functionId: string;
    toolName: string;
    timestamp: string;
  };
  arguments: IncidentApprovalArguments;
}

export interface IncidentApprovalArguments {
  priority: string;
  title: string;
  service: string;
  anomaly_id: string;
  metrics: {
    response_time: string;
    error_rate: string;
    affected_count: number;
    duration_minutes: number;
  };
  scope: string;
  assignee: {
    id: string;
    name: string;
  };
  reported_by: string;
  approvalRequest?: {
    functionId: string;
    toolName: string;
    timestamp: string;
  };
}

// Liquid template transform result
export interface LiquidTemplateResult {
  data: string;
}

// Slack trigger payload types
export interface SlackTriggerPayload {
  data: {
    event: {
      channel: string;
      thread_ts?: string;
      [key: string]: unknown;
    };
  };
}

// Output schema type (matching the JSON schema in the agent's outputSchema)
export interface IncidentResponseNotification {
  message_type: "incident_created" | "incident_rejected";
  channel: string;
  summary: string;
  incident_id?: string;
  incident_url?: string;
  incident_channel?: string;
  assignee_mention?: string;
  anomaly_id?: string;
  rejection_reason?:
    | "false_positive"
    | "duplicate"
    | "known_issue"
    | "scheduled_maintenance"
    | "below_threshold"
    | "manual_review"
    | "other";
  details?: {
    priority?: "P1" | "P2" | "P3" | "P4";
    service?: string;
    status?: string;
    title?: string;
    key_metrics?: string[];
    detected_at?: string;
  };
  actions?: string[];
  rejected_by?: string;
  rejected_at?: string;
  thread_ts?: string;
}

// Slack block message type
export interface SlackBlockMessage {
  blocks: Array<{
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
      text?: {
        type: string;
        text: string;
        emoji?: boolean;
      };
      style?: string;
      action_id?: string;
      value?: string;
    }>;
  }>;
}
