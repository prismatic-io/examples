export interface FlowConfig {
  id: string;
  name: string;
  description?: string;
  webhookUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputSchema?: any;
}

export interface EmbeddedUserConfig {
  sub: string; // Unique user ID (UUID recommended)
  organization: string; // Organization ID from Embedded tab
  customer: string; // External ID of the customer
  external_id?: string; // Usually same as sub
  name?: string; // User's name
  customer_name?: string; // Customer name (creates new if doesn't exist)
  role?: "admin" | "user"; // Defaults to "admin"
}

export interface PrismaticClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: (graphql: string, variables?: any) => Promise<any>;
  apiUrl: string;
  auth: string;
}

export interface OrganizationClient extends PrismaticClient {
  type: "organization";
}

export interface CustomerClient extends PrismaticClient {
  type: "customer";
  customerId: string;
}

export interface Integration {
  id: string;
  name: string;
  description?: string;
  versionNumber: number;
}

export interface Customer {
  id: string;
  externalId: string;
  name: string;
  description?: string;
}

export interface ExecutionResult {
  id: string;
  startedAt: string;
  endedAt?: string;
  error?: string;
  status: string;
}

export interface StepResult {
  stepName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  error?: string;
}
