import { batchFlowTrigger, flow } from "@prismatic-io/spectral";
import {
  FLOW_TRIGGER_PREFIX,
  OUTBOUND_MESSAGE_ACK_RESPONSE,
  SALESFORCE_API_VERSION,
} from "./constants";
import { createSfdcClient } from "./sfdcClient";
import {
  createFlowRecordSubscription,
  deactivateAndDeleteFlowResources,
  generatePrefixedName,
  getWebhookId,
} from "./util/outboundMessage";
import {
  createImportedLeadsTable,
  insertLeadsIntoDatabase,
} from "./util/postgres";
import {
  parseOutboundMessageNotifications,
  standardizeLeadData,
} from "./util/salesforce";
import {
  FlowTriggerInstanceState,
  LeadRecordTypeResult,
  SFDCFieldMappingResult,
  StandardizedLead,
  StandardizedLeadArray,
} from "./util/types";

const SALESFORCE_BATCH_SIZE = 200; // Number of records to fetch from Salesforce at a time
const PROCESS_BATCH_SIZE = 50; // Number of records to process in a single batch through `onExecution`

// The cursor the batched trigger carries between backfill pages (see `onDeploy`).
type SFDCPaginationState = { lastId: string };

export const importSalesforceLeads = flow({
  name: "Sync Salesforce Leads",
  stableKey: "sync-salesforce-leads",
  description:
    "Sync leads from Salesforce into a PostgreSQL database in batches, and then process new leads sent via webhook in real time.",

  batchConfig: { batchSize: PROCESS_BATCH_SIZE, concurrentBatchLimit: 3 },

  trigger: batchFlowTrigger<StandardizedLead, SFDCPaginationState>({
    onDeploy: async (context, payload) => {
      // Get the last ID we processed from the previous run, if any
      // and create a WHERE clause to only fetch newer leads from Salesforce
      const startId = payload.paginationState?.lastId;
      const whereClause = startId ? `WHERE Id > '${startId}'` : "";
      if (!startId) {
        // If this is the first time we're running, create the table to store imported leads
        await createImportedLeadsTable(
          context.configVars["PostgreSQL Connection"],
        );
      }
      const sfdcClient = createSfdcClient(
        context.configVars["Salesforce Connection"],
      );
      // The "Lead Record Type" and "Field Mapping" config vars are populated by
      // JSON Forms data sources (see configPages.ts), which are typed generically.
      // Cast them to the concrete shapes those data sources actually produce.
      const leadRecordType = (
        context.configVars["Lead Record Type"] as LeadRecordTypeResult
      ).recordType;
      const fieldMapping = context.configVars[
        "Field Mapping"
      ] as SFDCFieldMappingResult;
      const fieldsToSelect = [
        "Id",
        fieldMapping.name,
        fieldMapping.email,
        fieldMapping.phone,
      ].join(", ");
      // Page through the records by Id. Ordering by Id ascending lets us use the
      // last Id of each page as the cursor for the next (see `paginationState`).
      const response = await sfdcClient.query(
        `SELECT ${fieldsToSelect} FROM ${leadRecordType} ${whereClause} ORDER BY Id ASC LIMIT ${SALESFORCE_BATCH_SIZE}`,
      );
      const standardizedLeads = response.records.map((sfdcLead) =>
        standardizeLeadData(sfdcLead, fieldMapping, leadRecordType),
      );
      // An empty page means we've reached the end of the data set. Returning an
      // undefined paginationState tells Prismatic to stop calling `onDeploy`.
      if (standardizedLeads.length === 0) {
        return { items: [], paginationState: undefined };
      }
      return {
        items: standardizedLeads,
        paginationState: {
          // Save off the last Id we processed so the next page can start after it.
          lastId: response.records[response.records.length - 1].Id!,
        },
      };
    },

    // Runs every time Salesforce POSTs an outbound message to this flow's
    // webhook URL — i.e. whenever a new lead is created in real time. This
    // mirrors the `perform` function of the Salesforce custom component trigger
    // (flowOutboundMessageTrigger): parse the SOAP/XML body, extract the changed
    // records, and acknowledge receipt. We additionally standardize the records
    // into the same shape as the batch import so `onExecution` handles both the
    // same way.
    // Parsing the webhook body is synchronous, so this returns a resolved
    // promise rather than being declared `async`.
    onTrigger: (context, payload) => {
      const leadRecordType = (
        context.configVars["Lead Record Type"] as LeadRecordTypeResult
      ).recordType;
      const fieldMapping = context.configVars[
        "Field Mapping"
      ] as SFDCFieldMappingResult;

      const notifiedLeads = parseOutboundMessageNotifications(
        payload.body.data,
      );
      const standardizedLeads = notifiedLeads.map((lead) =>
        standardizeLeadData(lead, fieldMapping, leadRecordType),
      );

      // Real-time webhook fires aren't paginated, so there's no pagination
      // state to return. The ACK response tells Salesforce the outbound message
      // was received so it won't retry delivery.
      return Promise.resolve({
        items: standardizedLeads,
        response: OUTBOUND_MESSAGE_ACK_RESPONSE,
      });
    },
  }),

  // Webhook lifecycle handlers create and tear down the Salesforce resources
  // that drive the real-time `onTrigger` above. On deploy we create an outbound
  // message + record-triggered flow in Salesforce that POST new leads to this
  // flow's webhook URL; on delete we remove them. This is the code-native
  // equivalent of the custom component trigger's create/delete lifecycle
  // handlers (onInstanceDeployFlowFunction / onInstanceDeleteFlowFunction).
  webhookLifecycleHandlers: {
    create: async (context) => {
      const flowName = context.flow.name;
      context.logger.info(
        `Configuring Salesforce webhook subscription for "${flowName}"`,
      );

      const webhookUrl = context.webhookUrls[flowName];
      const webhookId = getWebhookId(webhookUrl);
      const client = createSfdcClient(
        context.configVars["Salesforce Connection"],
      );

      // If a previous deploy already created resources for this webhook, remove
      // them first so we always (re)create a clean subscription.
      const flowTriggerState = (context.crossFlowState.flowTriggerState ??
        {}) as Record<string, FlowTriggerInstanceState>;
      const existing = flowTriggerState[webhookId];
      if (existing?.flowFullName && existing?.outboundMessageFullName) {
        context.logger.info(
          "Existing subscription found; removing it before recreating",
        );
        await deactivateAndDeleteFlowResources(
          client,
          context.logger,
          existing.flowFullName,
          existing.outboundMessageFullName,
        );
      }

      // Subscribe to newly created leads. The outbound message carries the Id
      // plus the three mapped fields, which is exactly what `onTrigger` reads.
      const leadRecordType = (
        context.configVars["Lead Record Type"] as LeadRecordTypeResult
      ).recordType;
      const fieldMapping = context.configVars[
        "Field Mapping"
      ] as SFDCFieldMappingResult;
      const fields = [
        "Id",
        fieldMapping.name,
        fieldMapping.email,
        fieldMapping.phone,
      ];

      context.logger.info(
        `Creating subscription for new leads on "${leadRecordType}" with fields: ${fields.join(
          ", ",
        )}`,
      );

      const { flowFullName, outboundMessageFullName } =
        await createFlowRecordSubscription({
          client,
          name: generatePrefixedName(FLOW_TRIGGER_PREFIX, webhookId),
          endpointUrl: webhookUrl,
          triggerObject: leadRecordType,
          triggerOn: "Create",
          fields,
          version: SALESFORCE_API_VERSION,
        });
      context.logger.info(
        `Subscription created: flow "${flowFullName}", outbound message "${outboundMessageFullName}"`,
      );

      // Persist the resource identifiers so the delete handler can tear them down.
      flowTriggerState[webhookId] = { flowFullName, outboundMessageFullName };
      return {
        crossFlowState: { ...context.crossFlowState, flowTriggerState },
      };
    },

    delete: async (context) => {
      const flowName = context.flow.name;
      context.logger.info(
        `Tearing down Salesforce webhook subscription for "${flowName}"`,
      );

      const webhookId = getWebhookId(context.webhookUrls[flowName]);
      const flowTriggerState = (context.crossFlowState.flowTriggerState ??
        {}) as Record<string, FlowTriggerInstanceState>;
      const existing = flowTriggerState[webhookId];

      if (existing?.flowFullName && existing?.outboundMessageFullName) {
        const client = createSfdcClient(
          context.configVars["Salesforce Connection"],
        );
        await deactivateAndDeleteFlowResources(
          client,
          context.logger,
          existing.flowFullName,
          existing.outboundMessageFullName,
        );
      }

      // Forget the resources we just removed.
      delete flowTriggerState[webhookId];
      return {
        crossFlowState: { ...context.crossFlowState, flowTriggerState },
      };
    },
  },

  onExecution: async (context, params) => {
    // Both the initial backfill (`onDeploy`) and the real-time webhook
    // (`onTrigger`) funnel their records through the same synthesized trigger
    // result, so a batch of standardized leads always arrives here under
    // `params.onTrigger.results.body.data` regardless of which produced it.
    // Validate the batch before inserting.
    const leads = StandardizedLeadArray.parse(
      params.onTrigger.results.body.data,
    );
    await insertLeadsIntoDatabase(
      leads,
      context.configVars["PostgreSQL Connection"],
    );
    return { data: null };
  },
});

export default [importSalesforceLeads];
