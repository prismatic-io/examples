// Salesforce API response types

export interface SalesforceAccount {
  Name: string;
}

export interface SalesforceUser {
  Name: string;
}

export interface SalesforceOpportunity {
  Id: string;
  Name: string;
  Account?: SalesforceAccount;
  Amount?: number;
  StageName: string;
  CloseDate: string;
  NextStep?: string;
  NextStepDate__c?: string;
  Description?: string;
  Probability?: number;
  CreatedDate: string;
  LastModifiedDate: string;
  LastModifiedBy?: SalesforceUser;
}

export interface SalesforceQueryResult<T> {
  totalSize: number;
  done: boolean;
  records: T[];
}

export interface SalesforceUpdateResult {
  id: string;
  success: boolean;
  errors?: {
    statusCode: string;
    message: string;
    fields: string[];
  }[];
}

export interface SalesforceError extends Error {
  errorCode?: string;
  fields?: string[];
}
