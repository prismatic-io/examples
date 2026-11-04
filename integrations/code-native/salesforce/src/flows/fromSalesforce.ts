/**
 * Sync Salesforce data to Acme.
 *
 * Subscribe to changes in Salesforce using Salesforce Flows, and send those changes to Acme's API.
 */

import { flow } from "@prismatic-io/spectral";
import { createSalesforceClient } from "../salesforceClient";
import { FieldMapping } from "../dataSources/fieldMapperValidator";
import { createAcmeClient } from "../acmeClient";

interface TriggerBody {
  type: string;
  Id: string;
}

export const fromSalesforce = flow({
  stableKey: "from-salesforce",
  name: "From Salesforce",
  description: "Sync Salesforce data to Acme.",
  // Use the existing Flow Outbound Message trigger from the built-in Salesforce component
  // https://prismatic.io/docs/components/salesforce/#flow-outbound-message-webhook
  // This trigger will establish a webhook and send updated records to this flow
  onTrigger: {
    component: "salesforce",
    key: "flowOutboundMessageTrigger",
    values: {
      connection: { configVar: "Salesforce Connection" },
      prefix: { value: "acme" },
      triggerObject: { configVar: "Salesforce Record Type" },
    },
  },
  onExecution: async (context, trigger) => {
    // Create an authenticated Salesforce client
    const sfdcClient = createSalesforceClient(
      context.configVars["Salesforce Connection"],
      context.debug.enabled
    );

    // Create an authenticated Acme client
    const acmeClient = createAcmeClient(
      context.configVars["Acme Connection"],
      context.debug.enabled
    );

    // Salesforce sends updated records in the trigger body
    const records = trigger.onTrigger.results.body.data as TriggerBody[];

    // Get the field mapping that the user configured
    const fieldMapping = context.configVars[
      "Salesforce Field Mapping"
    ] as FieldMapping[];

    // For each updated record, retrieve the full record from Salesforce,
    // map the fields according to the field mapping, and send to Acme
    for (const record of records) {
      const salesforceRecord = await sfdcClient
        .sobject(record.type)
        .retrieve(record.Id);

      const mappedFields = fieldMapping.reduce(
        (acc, { salesforce, acme }) => ({
          [acme]: salesforceRecord[salesforce],
          ...acc,
        }),
        {}
      );

      await acmeClient.post("/post", mappedFields);
    }

    // Return an empty result
    return Promise.resolve({ data: null });
  },
});

export default fromSalesforce;
