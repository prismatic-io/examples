// Flow input and output types

// GetMyOpportunities flow types
export interface GetMyOpportunitiesInput {
  stage?: string;
  minAmount?: number;
  closeDateFrom?: string;
  closeDateTo?: string;
  limit?: number;
}

// UpdateOpportunity flow types
export interface UpdateOpportunityInput {
  opportunityId: string;
  stageName?: string;
  nextStep?: string;
  nextStepDate?: string;
  description?: string;
  amount?: number;
  closeDate?: string;
  probability?: number;
}

// Common output types
export interface OpportunityOutput {
  id: string;
  name: string;
  accountName: string | null;
  amount: number;
  stage: string;
  closeDate: string;
  nextStep: string | null;
  description: string | null;
  probability: number;
  createdDate: string;
  lastModifiedDate: string;
  daysToClose: number | null;
}

export interface UpdatedOpportunityOutput
  extends Omit<OpportunityOutput, "createdDate" | "daysToClose"> {
  lastModifiedBy: string | null;
}

export interface GetMyOpportunitiesOutput {
  opportunities: OpportunityOutput[];
  totalCount: number;
  userId: string;
  queryExecuted: string;
}

export interface UpdateOpportunityOutput {
  success: boolean;
  opportunity: UpdatedOpportunityOutput;
  fieldsUpdated: string[];
}

// Update data object type for Salesforce
export interface SalesforceOpportunityUpdate {
  Id: string;
  StageName?: string;
  NextStep?: string;
  NextStepDate__c?: string;
  Description?: string;
  Amount?: number;
  CloseDate?: string;
  Probability?: number;
}
