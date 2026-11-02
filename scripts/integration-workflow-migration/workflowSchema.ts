// Temporary type definitions for workflow schema
type ConditionCollection = any;
type KeyValueList = any;
type ValueList = any;

type CustomerConfigVariableGlobalId = string;
type ScopedConfigVariableGlobalId = string;
type ScopedConfigVariableIdentifier = string;

export type StepErrorHandlingConfiguration =
  | {
      errorHandlerType: "retry";
      delaySeconds: number;
      ignoreFinalError: boolean;
      maxAttempts: number;
    }
  | { errorHandlerType: "fail" }
  | { errorHandlerType: "ignore" };

export type WorkflowRetryConfiguration = {
  usesExponentialBackoff: boolean;
  delayMinutes: number;
  maxAttempts: number;
} | null;

interface YmlStepReferenceInput {
  type: "reference";
  value: string;
}

interface YmlStepTemplateInput {
  type: "template";
  value: string;
}

interface YmlStepConfigVarInput {
  type: "configVar";
  value: string;
}

interface YmlStepValueInput {
  type: "value";
  value: string;
  meta?: Record<string, unknown> & {
    sourceType?: "dataSource" | "manual";
  };
}

interface YmlStepConnectionInput {
  type: "scopedConfigVar";
  value:
    | ScopedConfigVariableIdentifier
    | ScopedConfigVariableGlobalId
    | CustomerConfigVariableGlobalId;
}

interface YmlStepComplexInput {
  type: "complex";
  value: ValueList | KeyValueList | ConditionCollection;
}

export interface YmlStep {
  stableKey?: string;
  name: string;
  isTrigger?: boolean;
  description: string;
  inputs: Record<
    string,
    | YmlStepTemplateInput
    | YmlStepComplexInput
    | YmlStepConfigVarInput
    | YmlStepReferenceInput
    | YmlStepValueInput
    | YmlStepConnectionInput
  >;
  action: {
    key: string;
    component: {
      isPublic: boolean;
      key: string;
      version: number | "LATEST";
    };
  };
  steps?: Array<YmlStep>;
  branches?: Array<YmlBranch>;
  errorConfig?: StepErrorHandlingConfiguration;
  schedule?: {
    value: string;
    type: "value" | "template";
    meta: {
      scheduleType: "none" | "minute" | "hour" | "day" | "week" | "custom";
      timeZone?: string;
    };
  };
}

export interface YmlBranch {
  name: string;
  steps: Array<YmlStep>;
}

export interface IntegrationDefinition {
  name: string;
  configPages: Array<unknown>;
  description: string;
  documentation: string;
  definitionVersion: 7;
  defaultInstanceProfile: "Default Instance Profile";
  endpointType: "flow_specific";
  definitionType: "integration" | "";
  isSynchronous?: boolean;
  labels?: Array<string> | null;
  requiredConfigVars:
    | Array<
        | {
            dataType: "connection";
            useScopedConfigVar: ScopedConfigVariableIdentifier;
            key: string;
          }
        | {
            dataType: "connection";
            connection: unknown;
            key: string;
          }
      >
    | undefined;
  flows: Array<{
    endpointSecurityType: "customer_optional";
    isSynchronous?: boolean;
    name: string;
    steps: Array<YmlStep>;
    retryConfig?: WorkflowRetryConfiguration;
  }>;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  documentation: string;
  definitionVersion: 1;
  definitionType: "workflow";
  flow: {
    isSynchronous?: boolean;
    name: string;
    steps: Array<YmlStep>;
    retryConfig?: WorkflowRetryConfiguration;
  };
}
