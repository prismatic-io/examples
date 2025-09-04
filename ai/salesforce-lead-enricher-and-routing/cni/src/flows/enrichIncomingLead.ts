import { flow } from "@prismatic-io/spectral";

/**
 * Enriched lead data structure
 */
interface EnrichedLeadData {
  company: string;
  employeeCount: number;
  vertical: string;
  score: number;
  companyDescription: string;
}
/**
 * TriggerPayload
 */
interface TriggerPayload {
  data: {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
  };
}

/**
 * Agent execution result
 */
interface AgentExecutionResult {
  data: {
    finalOutput: EnrichedLeadData;
  };
}
interface CreateToolResult {
  data: any;
}
interface CreateAgentResult {
  data: any;
}

// Constants
const MODEL = "gpt-5-mini-2025-08-07";
const SALESFORCE_API_VERSION = "63.0";

/**
 * Agent instructions for lead research
 */
const LEAD_RESEARCHER_INSTRUCTIONS = `When provided a new lead, attempt to research them based on their domain. Look for their industry, employee count, and the problem the company solves.
Score the lead based on the information you find to identify if its a fit for Prismatic.

Key scoring metrics:
B2B SaaS company + 7 points
Integration Needs + 3 points
Flower Store -10 points

If you are unable to find information about the lead return empty strings and a score of 0`;

/**
 * Lead enrichment output schema
 */
const LEAD_ENRICHMENT_SCHEMA = {
  type: "object",
  properties: {
    company: {
      type: "string",
    },
    employeeCount: {
      type: "number",
    },
    vertical: {
      type: "string",
    },
    score: {
      type: "number",
    },
    companyDescription: {
      type: "string",
    },
  },
  required: ["employeeCount", "vertical", "score", "companyDescription"],
  additionalProperties: false,
};

/**
 * Enrich Incoming Lead Flow
 *
 * Researches incoming leads using web search, enriches them with company data,
 * and creates them in Salesforce with a lead score.
 */
export const enrichIncomingLead = flow({
  name: "Enrich Incoming Lead",
  stableKey: "enrich-incoming-lead",
  description: "Research and enrich leads before creating them in Salesforce",
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const triggerPayload = params.onTrigger.results.body as TriggerPayload;
    context.logger.info("Processing incoming lead");

    // Step 1: Set up web search tool
    const setupWebResearchTool =
      await context.components.openai.createWebSearchTool<CreateToolResult>({
        name: "Web Search",
        searchContextSize: "high",
      });

    // Step 2: Create lead research agent
    context.logger.debug("Creating lead research agent");
    const createLeadResearchAgent =
      await context.components.openai.createAgent<CreateAgentResult>({
        instructions: LEAD_RESEARCHER_INSTRUCTIONS,
        modelName: MODEL,
        name: "Lead Researcher",
        outputSchema: JSON.stringify(LEAD_ENRICHMENT_SCHEMA),
        outputSchemaName: "output",
        outputSchemaStrict: false,
        tools: [setupWebResearchTool.data],
      });

    // Step 3: Research and enrich the lead
    const researchAndEnrichLead =
      await context.components.openai.runAgent<AgentExecutionResult>({
        agentConfig: createLeadResearchAgent.data,
        maxTurns: "10",
        openaiConnection: configVars["OpenAI Connection"],
        userInput: `Research this lead on the web:
Company: ${triggerPayload.data.company}
Email: ${triggerPayload.data.email}
Name: ${triggerPayload.data.firstName} ${triggerPayload.data.lastName}`,
      });

    const enrichedData = researchAndEnrichLead.data.finalOutput;
    context.logger.info(
      "Lead enrichment complete",
      enrichedData.company,
      enrichedData.employeeCount,
      enrichedData.score,
      enrichedData.companyDescription,
    );

    if (enrichedData.score === 0) {
      context.logger.info("Lead score is 0, skipping lead creation");
      return { data: null };
    }
    // Step 4: Create lead in Salesforce
    context.logger.info("Creating lead in Salesforce");
    const createLead = await context.components.salesforce.createLead({
      company: triggerPayload.data.company,
      connection: configVars["Salesforce Connection"],
      description: enrichedData.companyDescription,
      email: triggerPayload.data.email,
      employeeCount: enrichedData.employeeCount.toString(),
      firstName: triggerPayload.data.firstName,
      lastName: triggerPayload.data.lastName,
      leadStatus: "Open",
      version: SALESFORCE_API_VERSION,
    });

    context.logger.info("Lead created successfully");

    return { data: createLead };
  },
});

export default enrichIncomingLead;
