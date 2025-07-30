import { flow } from "@prismatic-io/spectral";

export const createIncident = flow({
  name: "Create Incident",
  stableKey: "create-incident",
  description: "",
  isSynchronous: true,
  endpointSecurityType: "customer_optional",
  onTrigger: {
    component: "openai",
    key: "toolFlowTrigger",
    values: {},
  },
  schemas: {
    invoke: {
      $schema: "http://json-schema.org/draft-07/schema#",
      additionalProperties: false,
      description: "Arguments for the create_incident tool call",
      properties: {
        anomaly_id: {
          description: "Optional reference to the original anomaly detection",
          examples: ["DET-892734"],
          pattern: "^DET-[0-9]+$",
          type: "string",
        },
        assignee: {
          additionalProperties: false,
          description: "The on-call engineer assigned to handle the incident",
          properties: {
            email: {
              description: "Email address of the assignee",
              examples: ["jake.hagle@prismatic.io"],
              format: "email",
              type: "string",
            },
            handle: {
              description: "Slack username/handle",
              examples: ["jake.hagle"],
              pattern: "^[a-z0-9][a-z0-9._-]{0,79}$",
              type: "string",
            },
            id: {
              description: "Slack user ID",
              examples: ["U01A5A5HU0Y"],
              pattern: "^U[A-Z0-9]{8,12}$",
              type: "string",
            },
            name: {
              description: "Full name of the assignee",
              examples: ["Jake Hagle"],
              maxLength: 100,
              minLength: 1,
              type: "string",
            },
          },
          required: ["id", "name", "handle", "email"],
          type: "object",
        },
        description: {
          description:
            "Detailed description of the incident including key metrics and impact",
          examples: [
            "Payment Gateway Critical Latency - Payment processing experiencing severe delays. P95 response time: 8200ms (baseline: 500ms), Error rate: 15.2%, 2341 transactions affected over 8 minutes",
          ],
          maxLength: 500,
          minLength: 10,
          type: "string",
        },
        metrics: {
          additionalProperties: true,
          description: "Optional structured metrics data",
          properties: {
            affected_count: {
              minimum: 0,
              type: "integer",
            },
            duration_minutes: {
              minimum: 0,
              type: "integer",
            },
            error_rate: {
              pattern: "^[0-9.]+%$",
              type: "string",
            },
            response_time: {
              type: "string",
            },
          },
          type: "object",
        },
        priority: {
          description: "Incident priority level",
          enum: ["P1", "P2", "P3", "P4"],
          type: "string",
        },
        reported_by: {
          const: "Acme Incident Assistant",
          description: "System or entity that reported the incident",
          type: "string",
        },
        request_id: {
          description: "Optional tracking ID for this incident request",
          examples: ["INC-REQ-892734"],
          pattern: "^[A-Z0-9-]+$",
          type: "string",
        },
        scope: {
          description: "Geographic regions or components affected",
          examples: [
            "us-east-1, us-west-2, eu-west-1",
            "All regions",
            "Production environment",
            "Customer-facing APIs",
          ],
          maxLength: 200,
          minLength: 1,
          type: "string",
        },
        service: {
          description: "The affected service identifier",
          examples: [
            "payment-gateway",
            "auth-service",
            "api-gateway",
            "database-cluster",
          ],
          maxLength: 100,
          minLength: 1,
          type: "string",
        },
        title: {
          description:
            "A clear title summarizing the issue. Do not include metrics in the title unless its a summary.",
          type: "string",
        },
      },
      required: [
        "description",
        "priority",
        "service",
        "scope",
        "assignee",
        "reported_by",
      ],
      title: "Create Incident Arguments",
      type: "object",
    },
  },
  onExecution: async (context, params) => {
    const { configVars } = context;

    function remapToIncidentCreated(prismaticPayload: any) {
      const data = prismaticPayload.results.body.data;
      const now = new Date().toISOString();

      // Generate incident ID from request ID or create new one
      const incidentId = data.request_id
        ? `INC-${data.request_id.split("-").slice(-2).join("-")}`
        : `INC-2025-${Math.floor(Math.random() * 10000)}`;

      return {
        status: "success",
        incident: {
          id: incidentId,
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: "investigating",
          service: data.service,
          scope: data.scope,
          assignee: {
            id: data.assignee.id,
            name: data.assignee.name,
            handle: data.assignee.handle,
            email: data.assignee.email,
          },
          reported_by: data.reported_by,
          created_at: now,
          updated_at: now,
          incident_url: `https://incidents.acme.io/incidents/${incidentId}`,
          slack_channel: `#${incidentId.toLowerCase()}`,
          timeline: [
            {
              timestamp: now,
              action: "incident_created",
              actor: data.reported_by,
              message: "Incident created from anomaly detection",
            },
          ],
          metadata: {
            anomaly_id: data.anomaly_id,
            approval_request_id: data.request_id,
            approved_by: data.assignee.id,
            approved_at: new Date(Date.now() - 2000).toISOString(), // 2 seconds before creation
            metrics: data.metrics,
            execution_id: prismaticPayload.results.executionId,
          },
        },
        message: `Incident ${incidentId} has been successfully created and assigned to ${data.assignee.name}`,
      };
    }

    // Usage:
    const transformedPayload = remapToIncidentCreated(params.onTrigger);
    return { data: transformedPayload };
  },
});

export default createIncident;
