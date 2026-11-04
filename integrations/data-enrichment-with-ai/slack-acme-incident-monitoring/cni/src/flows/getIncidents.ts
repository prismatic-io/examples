import { flow } from "@prismatic-io/spectral";

export const getIncidents = flow({
  name: "Get Incidents",
  stableKey: "get-incidents",
  description: "",
  isSynchronous: true,
  endpointSecurityType: "customer_optional",
  onTrigger: {
    component: "openai",
    key: "toolFlowTrigger",
    values: {},
  },
  onExecution: async (context, params) => {
    const { configVars } = context;
    const getIncidents = await context.components.code.runCode({
      code: `/*
  Access config variables by name through the configVars object. e.g.
    const apiEndpoint = \`\${configVars["App Base URL"]}/api\`;

  Access previous steps' results through the stepResults object. Trigger
  and step names are camelCased. If the step "Get Data from API" returned
  {"foo": "bar", "baz": 123}, you could destructure that data with:
    const { foo, baz } = stepResults.getDataFromApi.results;

  You can return string, number or complex object data. e.g.
    return { data: { foo: "Hello", bar: 123.45, baz: true } };
*/

module.exports = async ({ logger, configVars }, stepResults) => {
  function getActiveIncidents() {
  // Simulated API call to Acme Incident Platform
  return {
    status: "success",
    timestamp: new Date().toISOString(),
    data: {
      total_active: 3,
      incidents: [
        {
          id: "INC-1247",
          priority: "P1",
          title: "Database connection pool exhausted",
          status: "investigating",
          affected_service: "auth-service",
          created_at: "2025-01-22T01:45:00Z",
          assigned_to: "database-team",
          assignee: "Sarah Chen",
          duration_minutes: 17,
          impact: "Users experiencing login failures",
          last_update: "Team investigating connection leak in auth service"
        },
        {
          id: "INC-1246",
          priority: "P2",
          title: "Elevated API response times",
          status: "identified",
          affected_service: "api-gateway",
          created_at: "2025-01-22T00:30:00Z",
          assigned_to: "platform-team",
          assignee: "Mike Johnson",
          duration_minutes: 92,
          impact: "5% of requests experiencing >2s latency",
          last_update: "Root cause identified as inefficient database query"
        },
        {
          id: "INC-1245",
          priority: "P3",
          title: "Webhook delivery delays",
          status: "monitoring",
          affected_service: "webhook-processor",
          created_at: "2025-01-21T23:15:00Z",
          assigned_to: "platform-team",
          assignee: "Alex Kim",
          duration_minutes: 167,
          impact: "Customer webhooks delayed by ~30 seconds",
          last_update: "Temporary fix applied, monitoring for stability"
        }
      ]
    }
  };
}
  const incidents = getActiveIncidents()
  return { data: incidents };
};
`,
    });
    return { data: getIncidents };
  },
});

export default getIncidents;
