import { flow } from "@prismatic-io/spectral";
import {
  createSalesforceConnection,
  getCurrentUserId,
} from "../services/salesforceClient";
import { GetMyOpportunitiesInput, SalesforceOpportunity } from "../types";

export const getMyOpportunities = flow({
  name: "Get My Opportunities",
  stableKey: "get-my-opportunities",
  description:
    "Retrieve opportunities owned by the current user with relevant details",
  isAgentFlow: true,
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        stage: {
          type: "string",
          description: "Filter by stage name (optional)",
        },
        minAmount: {
          type: "number",
          description: "Minimum opportunity amount (optional)",
        },
        closeDateFrom: {
          type: "string",
          description:
            "Start date for close date range filter (YYYY-MM-DD format, optional)",
        },
        closeDateTo: {
          type: "string",
          description:
            "End date for close date range filter (YYYY-MM-DD format, optional)",
        },
        limit: {
          type: "number",
          description:
            "Maximum number of opportunities to return (default: 50)",
          default: 50,
        },
      },
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const connection = configVars["Salesforce Connection"];

    const conn = createSalesforceConnection(connection);

    // Get current user ID
    const userId = await getCurrentUserId(conn);

    // Get input parameters
    const input = params.onTrigger.results.body.data as GetMyOpportunitiesInput;

    // Build SOQL query
    let query = `
      SELECT
        Id,
        Name,
        Account.Name,
        Amount,
        StageName,
        CloseDate,
        NextStep,
        Description,
        Probability,
        CreatedDate,
        LastModifiedDate
      FROM Opportunity
      WHERE OwnerId = '${userId}'
    `;

    // Add optional filters
    if (input?.stage) {
      query += ` AND StageName = '${input.stage}'`;
    }

    if (input?.minAmount) {
      query += ` AND Amount >= ${input.minAmount}`;
    }

    if (input?.closeDateFrom) {
      query += ` AND CloseDate >= ${input.closeDateFrom}`;
    }

    if (input?.closeDateTo) {
      query += ` AND CloseDate <= ${input.closeDateTo}`;
    }

    // Add ordering and limit
    query += ` ORDER BY CloseDate ASC`;
    query += ` LIMIT ${input?.limit || 50}`;

    try {
      // Execute query
      const result = await conn.query<SalesforceOpportunity>(query);

      // Transform results for better AI consumption
      const opportunities = result.records.map((opp) => ({
        id: opp.Id,
        name: opp.Name,
        accountName: opp.Account?.Name || null,
        amount: opp.Amount || 0,
        stage: opp.StageName,
        closeDate: opp.CloseDate,
        nextStep: opp.NextStep || null,
        description: opp.Description || null,
        probability: opp.Probability || 0,
        createdDate: opp.CreatedDate,
        lastModifiedDate: opp.LastModifiedDate,
        daysToClose: opp.CloseDate
          ? Math.ceil(
              (new Date(opp.CloseDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : null,
      }));

      return {
        data: {
          opportunities,
          totalCount: result.totalSize,
          userId,
          queryExecuted: query.trim(),
        },
      };
    } catch (e) {
      const error = e as Error;
      throw new Error(`Failed to retrieve opportunities: ${error.message}`);
    }
  },
});

export default getMyOpportunities;
