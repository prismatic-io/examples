import { flow } from "@prismatic-io/spectral";
import { createSalesforceConnection } from "../services/salesforceClient";
import {
  UpdateOpportunityInput,
  UpdateOpportunityOutput,
  UpdatedOpportunityOutput,
  SalesforceOpportunityUpdate,
  SalesforceOpportunity,
} from "../types";

export const updateOpportunity = flow({
  name: "Update Opportunity",
  stableKey: "update-opportunity",
  description:
    "Update specific fields on an opportunity (stage, next step, description, etc.)",
  isAgentFlow: true,
  isSynchronous: true,
  schemas: {
    invoke: {
      properties: {
        opportunityId: {
          type: "string",
          description: "The ID of the opportunity to update",
        },
        stageName: {
          type: "string",
          description: "New stage for the opportunity (optional)",
        },
        nextStep: {
          type: "string",
          description: "Next action to be taken (optional)",
        },
        nextStepDate: {
          type: "string",
          description:
            "Date for the next step (YYYY-MM-DD format, optional - requires custom field NextStepDate__c)",
        },
        description: {
          type: "string",
          description: "Summary or notes about the opportunity (optional)",
        },
        amount: {
          type: "number",
          description: "Update the opportunity amount (optional)",
        },
        closeDate: {
          type: "string",
          description: "Update the close date (YYYY-MM-DD format, optional)",
        },
        probability: {
          type: "number",
          description: "Update the probability percentage (optional, 0-100)",
        },
      },
    },
  },
  endpointSecurityType: "customer_optional",
  onExecution: async (context, params) => {
    const { configVars } = context;
    const connection = configVars["Salesforce Connection"];

    const conn = createSalesforceConnection(connection);

    // Get input parameters
    const input = params.onTrigger.results.body.data as UpdateOpportunityInput;

    if (!input?.opportunityId) {
      throw new Error("opportunityId is required");
    }

    // Build update object with only provided fields
    const updateData: Omit<SalesforceOpportunityUpdate, "Id"> = {};

    if (input.stageName !== undefined) {
      updateData.StageName = input.stageName;
    }

    if (input.nextStep !== undefined) {
      updateData.NextStep = input.nextStep;
    }

    if (input.nextStepDate !== undefined) {
      // This assumes a custom field exists - will fail gracefully if not
      updateData.NextStepDate__c = input.nextStepDate;
    }

    if (input.description !== undefined) {
      updateData.Description = input.description;
    }

    if (input.amount !== undefined) {
      updateData.Amount = input.amount;
    }

    if (input.closeDate !== undefined) {
      updateData.CloseDate = input.closeDate;
    }

    if (input.probability !== undefined) {
      // Ensure probability is between 0 and 100
      updateData.Probability = Math.max(0, Math.min(100, input.probability));
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields provided to update");
    }

    try {
      // Update the opportunity
      await conn.sobject("Opportunity").update({
        Id: input.opportunityId,
        ...updateData,
      });

      // Fetch the updated opportunity to return current state
      const updatedOpp = (await conn
        .sobject("Opportunity")
        .retrieve(input.opportunityId, {
          fields: [
            "Id",
            "Name",
            "Account.Name",
            "Amount",
            "StageName",
            "CloseDate",
            "NextStep",
            "Description",
            "Probability",
            "LastModifiedDate",
            "LastModifiedBy.Name",
          ],
        })) as unknown as SalesforceOpportunity;

      const opportunity: UpdatedOpportunityOutput = {
        id: updatedOpp.Id,
        name: updatedOpp.Name,
        accountName: updatedOpp.Account?.Name || null,
        amount: updatedOpp.Amount || 0,
        stage: updatedOpp.StageName,
        closeDate: updatedOpp.CloseDate,
        nextStep: updatedOpp.NextStep || null,
        description: updatedOpp.Description || null,
        probability: updatedOpp.Probability || 0,
        lastModifiedDate: updatedOpp.LastModifiedDate,
        lastModifiedBy: updatedOpp.LastModifiedBy?.Name || null,
      };

      const output: UpdateOpportunityOutput = {
        success: true,
        opportunity,
        fieldsUpdated: Object.keys(updateData),
      };

      return { data: output };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // Check if it's a custom field error and provide helpful message
      if (message.includes("NextStepDate__c")) {
        throw new Error(
          "NextStepDate__c custom field not found. Please create this custom date field in Salesforce or remove the nextStepDate parameter."
        );
      }
      throw new Error(`Failed to update opportunity: ${message}`);
    }
  },
});

export default updateOpportunity;
