export interface IntegrationSchema {
  definitionVersion: 7;
  name: string;
  defaultInstanceProfile: string;
  description: string;
  documentation?: string;
  category?: string;
  labels?: string[];
  requiredConfigVars?: RequiredConfigVar[];
  renameAttributes?: RenameIntegrationAttributes;
  endpointType?: EndpointTypeEnum;
  preprocessFlowName?: string;
  externalCustomerIdField?: SimpleInput;
  externalCustomerUserIdField?: SimpleInput;
  flowNameField?: SimpleInput;
  flows: Flow[];
  configPages?: ConfigPage[];
}

export interface Flow {
  name: string;
  description?: string;
  isSynchronous?: boolean;
  retryConfig?: RetryConfig;
  queueConfig?: FlowControlConfig;
  endpointSecurityType?: EndpointSecurityTypeEnum;
  organizationApiKeys?: string[];
  renameAttributes?: RenameFlowAttributes;
  schemas?: FlowSchemas;
  steps: Step[];
}

export interface FlowSchemas {
  invoke?: unknown;
  result?: unknown;
}

export interface Step {
  action: ComponentKeySelector;
  name: string;
  description?: string;
  inputs?: Record<string, Input>;
  steps?: Step[];
  branches?: Branch[];
  isTrigger?: boolean;
  schedule?: Schedule;
  errorConfig?: ErrorConfig;
}

export interface ConfigPage {
  name: string;
  tagline?: string;
  userLevelConfigured?: boolean;
  elements: ConfigPageElement[];
}

export interface ConfigPageElement {
  type: ConfigPageElementTypeEnum;
  value: string;
}

export type Input = SimpleInput | ComplexInput;

export interface SimpleInput {
  name?: string | SimpleInput;
  type: SimpleInputTypeEnum;
  value: string;
  meta?: Record<string, unknown>;
}

export interface ComplexInput {
  name?: string;
  type: ComplexInputTypeEnum;
  value: ComplexInputValue;
  meta?: Record<string, unknown>;
}

export type ComplexInputValue = Array<
  string | Input | ComplexInputValue | undefined
>;

export interface Branch {
  name: string;
  steps: Step[];
}

export interface Component {
  key: string;
  version: number;
  isPublic: boolean;
}

export interface ComponentKeySelector {
  component: Component;
  key: string;
}

export interface ConnectionComponentKeySelector extends ComponentKeySelector {
  template?: string;
}

export interface Schedule {
  type: SimpleInputTypeEnum;
  value: string;
  meta: {
    scheduleType: ScheduleTypeEnum;
    timeZone?: string;
  };
}

export interface ErrorConfig {
  errorHandlerType?: StepErrorHandlerTypeEnum;
  // Times 0-5
  maxAttempts?: number;
  // Seconds 0-60
  delaySeconds?: number;
  usesExponentialBackoff?: boolean;
  ignoreFinalError?: boolean;
}

export interface RenameIntegrationAttributes {
  requiredConfigVars?: RenameAttr[];
  flows?: RenameAttr[];
}

export interface RenameFlowAttributes {
  steps?: RenameAttr[];
}

export interface RenameAttr {
  oldName: string;
  newName: string;
}

export interface RetryConfig {
  // Times 1-3
  maxAttempts: number;
  // Spaced 0-60
  delayMinutes: number;
  usesExponentialBackoff: boolean;
  uniqueRequestIdField?: SimpleInput;
}

export interface FlowControlConfig {
  usesFifoQueue: boolean;
  singletonExecutions?: boolean;
  dedupeIdField?: SimpleInput;
}

export type RequiredConfigVar =
  | DefaultRequiredConfigVar
  | ConnectionConfigVar
  | DataSourceConfigVar
  | ScopedConfigVar;

export interface DefaultRequiredConfigVar {
  key: string;
  defaultValue?: string;
  // TODO: Post-kraken
  // Remove this
  header?: string;
  dataType?: Exclude<DefaultConfigVarDataTypeEnum, "connection">;
  pickList?: string[];
  scheduleType?: ScheduleTypeEnum;
  timeZone?: string;
  codeLanguage?: CodeLanguageEnum;
  description?: string;
  orgOnly?: boolean;
  collectionType?: CollectionTypeEnum;
  meta?: Record<string, unknown>;
}

export interface DataSourceConfigVar extends DefaultRequiredConfigVar {
  dataSource: ComponentKeySelector;
  inputs?: Record<string, Input>;
}

export type SimpleInputTypeEnum =
  | "value"
  | "reference"
  | "configVar"
  | "template"
  | "dataSource";
export type ComplexInputTypeEnum = "complex";

export interface ConnectionConfigVar {
  key: string;
  description?: string;
  // TODO: Post-kraken
  // Remove this
  header?: string;
  dataType?: Extract<DefaultConfigVarDataTypeEnum, "connection">;
  connection: ConnectionComponentKeySelector;
  inputs?: Record<string, Input>;
  orgOnly?: boolean;
  meta?: Record<string, unknown>;
}

export interface ScopedConfigVar {
  key: string;
  description?: string;
  // TODO: Post-kraken
  // Remove this
  header?: string;
  dataType?: Extract<DefaultConfigVarDataTypeEnum, "connection">;
  useScopedConfigVar: string;
  meta?: Record<string, unknown>;
}

export type ScheduleTypeEnum =
  | "none"
  | "custom"
  | "minute"
  | "hour"
  | "day"
  | "week";

export type ConfigVarDataTypeEnum =
  | "string"
  | "date"
  | "timestamp"
  | "picklist"
  | "schedule"
  | "code"
  | "boolean";

export type DefaultConfigVarDataTypeEnum =
  | "string"
  | "date"
  | "timestamp"
  | "picklist"
  | "schedule"
  | "code"
  | "boolean"
  | "number"
  // Backend schema does not include 'connection' or 'dataSource' as yml validation doesn't have the equivalent of Exclude/Extract
  | "connection"
  | "credential"
  | "objectSelection"
  | "objectFieldMap"
  | "jsonForm";

export type DataSourceConfigVarDataTypeEnum = Exclude<
  DefaultConfigVarDataTypeEnum,
  "connection"
>;

export type CollectionTypeEnum = "valuelist" | "keyvaluelist";

export type CodeLanguageEnum = "json" | "xml" | "html";

export type EndpointTypeEnum =
  | "flow_specific"
  | "instance_specific"
  | "shared_instance";

export type StepErrorHandlerTypeEnum = "fail" | "ignore" | "retry";

export type ConfigPageElementTypeEnum =
  | "configVar"
  | "htmlElement"
  | "jsonForm";

export type EndpointSecurityTypeEnum =
  | "unsecured"
  | "customer_optional"
  | "customer_required"
  | "organization";
