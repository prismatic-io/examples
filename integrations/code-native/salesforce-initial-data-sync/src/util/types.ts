import z from "zod";

/**
 * Regardless of which Salesforce object we query, we'll
 * standardize the data into this shape so that we can
 * easily insert it into our database.
 */
export const StandardizedLead = z.object({
  sfdcId: z.string(),
  recordType: z.string(),
  name: z.string(),
  email: z.email().nullable(),
  phone: z.string().nullable(),
});
export type StandardizedLead = z.infer<typeof StandardizedLead>;
export const StandardizedLeadArray = z.array(StandardizedLead);
export type StandardizedLeadArray = z.infer<typeof StandardizedLeadArray>;

export interface SFDCFieldMappingResult {
  name: string;
  email: string;
  phone: string;
}

export interface LeadRecordTypeResult {
  recordType: string;
}

/**
 * A Salesforce sObject extracted from an outbound message, flattened from the
 * verbose SOAP/XML representation into a plain object. The `type` is the
 * object's API name (e.g. "Lead") and the remaining keys are field API names.
 */
export interface CleanSObject {
  type: string;
  Id: string;
  [field: string]: unknown;
}

/**
 * The shape of the SOAP envelope Salesforce POSTs to our webhook URL when an
 * outbound message fires. We only type the parts we read; `Notification` is a
 * single object when one record changes and an array when several do.
 */
export interface SalesforceOutboundEnvelope {
  "soapenv:Envelope"?: {
    "soapenv:Body"?: {
      notifications?: {
        Notification?: Record<string, unknown> | Record<string, unknown>[];
      };
    };
  };
}

/**
 * The minimal Salesforce Flow metadata we send to the Metadata API. Salesforce
 * accepts many more fields (e.g. `start`, `actionCalls`); the index signature
 * keeps this type permissive while documenting the fields we always set.
 */
export interface FlowMetadata {
  fullName: string;
  label?: string;
  description?: string;
  processType?: string;
  status?: "Active" | "Draft" | "Obsolete" | "InvalidDraft";
  runInMode?:
    | "DefaultMode"
    | "SystemModeWithoutSharing"
    | "SystemModeWithSharing";
  [key: string]: unknown;
}

/**
 * The identifiers of the Salesforce resources we create for a given webhook URL,
 * persisted in `crossFlowState` so we can tear them down on delete (or recreate
 * them cleanly on redeploy).
 */
export interface FlowTriggerInstanceState {
  flowFullName: string;
  outboundMessageFullName: string;
}
