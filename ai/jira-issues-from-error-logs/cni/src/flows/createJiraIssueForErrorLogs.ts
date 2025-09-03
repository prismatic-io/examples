import { flow } from "@prismatic-io/spectral";
import { config } from "dotenv";

/**
 * Jira issue data structure for error logs
 */
interface JiraIssueData {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  issue_type: "Bug";
  severity: 1 | 2 | 3 | 4 | 5;
  confidence: number;
}
/**
 * Incoming logs payload
 */
interface TriggerPayload {
  service: string;
  environment: string;
  host: string;
  logs: Array<{
    timestamp: string;
    level: string;
    logger: string;
    message: string;
  }>;
}

/**
 * OpenAI agent creation result
 */
interface AgentCreationResult {
  data: any;
}

/**
 * OpenAI agent execution result
 */
interface AgentExecutionResult {
  data: {
    finalOutput: JiraIssueData;
  };
}

/**
 * Jira issue creation response
 */
interface JiraIssueCreationResult {
  data: {
    id: string;
    key: string;
    self: string;
  };
}

// Constants for configuration
const MODELS = {
  LOG_ANALYZER: "gpt-5-mini-2025-08-07",
} as const;

const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.8, // Clear error with stack trace
  MEDIUM: 0.6, // Timeout or connection issue
  LOW: 0.3, // Warning that might be transient
} as const;

/**
 * Jira issue output schema for structured data extraction
 */
const JIRA_ISSUE_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "JiraIssueOutput",
  type: "object",
  required: [
    "title",
    "description",
    "priority",
    "issue_type",
    "severity",
    "confidence",
  ],
  properties: {
    title: {
      type: "string",
      maxLength: 100,
      description: "Brief description of the error",
    },
    description: {
      type: "string",
      description:
        "Detailed description including what happened, when, and error details",
    },
    priority: {
      type: "string",
      enum: ["High", "Medium", "Low"],
      description: "Issue priority level",
    },
    issue_type: {
      type: "string",
      enum: ["Bug"],
      description: "Type of Jira issue. Always capitalized",
    },
    severity: {
      type: "integer",
      minimum: 1,
      maximum: 5,
      description: "Impact severity (1=minimal, 5=critical)",
    },
    confidence: {
      type: "number",
      minimum: 0.0,
      maximum: 1.0,
      description: "Confidence score that this needs a Jira ticket",
    },
  },
  additionalProperties: false,
};

/**
 * Agent instructions for log analysis
 */
const LOG_ANALYZER_INSTRUCTIONS = `You are a log analyzer that creates Jira issues from system errors.

## Your Task
1. Identify the main error in the logs
2. Extract the details necessary to create a Jira issue
3. Focus only on ERROR and CRITICAL level logs

## Priority Rules
- CRITICAL logs or customer-facing errors → High
- ERROR logs → Medium
- WARN logs → Low

## Severity Scale
1. **Minimal** - Cosmetic issue, no functional impact
2. **Minor** - Small feature affected, easy workaround exists
3. **Moderate** - Feature degraded, some users impacted
4. **Major** - Feature broken, many users affected
5. **Critical** - System down, data loss, or security issue

## Confidence Score
Rate 0.0 to 1.0 based on:
- Clear error with stack trace → 0.8-1.0
- Timeout or connection issue → 0.6-0.8
- Warning that might be transient → 0.3-0.5
- Unclear if action needed → 0.0-0.3

## Important Guidelines
- Keep the title clear and actionable
- Always output your response using the provided schema
`;
/**
 * Create Jira Issue for Error Logs Flow
 *
 * This flow automatically analyzes system error logs and creates Jira issues
 * for significant errors that require attention. It uses AI to intelligently
 * classify errors, determine their severity, and generate appropriate ticket
 * descriptions.
 */
export const createJiraIssueForErrorLogs = flow({
  name: "Create Jira Issue for Error Logs",
  stableKey: "create-jira-issue-for-error-logs",
  description:
    "Automatically analyze error logs and create Jira issues for critical errors using AI",
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;

    // Validate input logs exist
    if (!params?.onTrigger?.results?.body?.data) {
      context.logger.warn("No log data received in trigger");
      return {
        data: {
          error: "No log data provided",
          success: false,
        },
      };
    }

    const logData = params.onTrigger.results.body.data as TriggerPayload;

    context.logger.info("Analyzing error logs for Jira issue creation");

    // Step 1: Create AI agent for log analysis
    context.logger.debug("Creating log analyzer agent");
    const createLogAnalyzer =
      await context.components.openai.createAgent<AgentCreationResult>({
        instructions: LOG_ANALYZER_INSTRUCTIONS,
        mcpServers: [],
        modelName: MODELS.LOG_ANALYZER,
        name: "Log Analysis Expert",
        outputSchema: JSON.stringify(JIRA_ISSUE_SCHEMA),
        outputSchemaName: "jira_issue_output",
        outputSchemaStrict: false,
        tools: [],
      });

    // Step 2: Analyze logs and extract Jira issue data
    context.logger.info(
      "Running log analysis to extract issue details for",
      JSON.stringify(logData),
    );
    const extractJiraIssueInputs =
      await context.components.openai.runAgent<AgentExecutionResult>({
        agentConfig: createLogAnalyzer.data,
        maxTurns: "10",
        openaiConnection: configVars["OpenAI Connection"],
        previousResponseId: "",
        userInput: `Analyze the following logs and attempt to extract the necessary fields to create a Jira issue:\n\n${JSON.stringify(
          logData,
        )}`,
      });

    const issueData = extractJiraIssueInputs.data.finalOutput;

    // Step 3: Check confidence threshold before creating issue
    if (issueData.confidence < CONFIDENCE_THRESHOLDS.LOW) {
      context.logger.info("Confidence too low to create Jira issue", {
        confidence: issueData.confidence,
        threshold: CONFIDENCE_THRESHOLDS.LOW,
      });
      return {
        data: {
          message: "No significant errors requiring Jira ticket",
          confidence: issueData.confidence,
          analysis: issueData,
          success: true,
        },
      };
    }

    context.logger.info("Creating Jira issue", {
      title: issueData.title,
      priority: issueData.priority,
      severity: issueData.severity,
      confidence: issueData.confidence,
    });

    // Step 4: Create Jira issue
    const createIssue =
      await context.components.atlassianJira.createIssue<JiraIssueCreationResult>(
        {
          issueTypeId: configVars["Issue Type"],
          projectId: configVars["Project"],
          summary: issueData.title,
          description: issueData.description,
          jiraConnection: configVars["Jira Connection"],
          ADFdescription: "", // FIXME: Required by action
        },
      );

    context.logger.info("Jira issue created successfully", {
      issueKey: createIssue.data?.key,
      issueId: createIssue.data?.id,
    });

    // Step 5: Return comprehensive result
    return {
      data: {
        jiraIssue: createIssue.data,
        analysis: {
          title: issueData.title,
          priority: issueData.priority,
          severity: issueData.severity,
          confidence: issueData.confidence,
        },
        success: true,
      },
    };
  },
});

export default createJiraIssueForErrorLogs;
