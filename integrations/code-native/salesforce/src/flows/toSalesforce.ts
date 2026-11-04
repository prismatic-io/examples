/**
 * Sync data to Salesforce from Acme.
 *
 * Acme will send data to this flow, which will then create or update records in Salesforce.
 */

import { flow, util } from "@prismatic-io/spectral";
import zod from "zod";
import { FieldMapping } from "../dataSources/fieldMapperValidator";
import { createSalesforceClient } from "../salesforceClient";

// Ensure the webhook payload matches the expected schema
const acmePayloadSchema = zod
  .object({
    // If external_id is provided, we'll use it to upsert the Salesforce record
    external_id: zod.string().optional(),
    first_name: zod.string(),
    last_name: zod.string(),
    email: zod.email(),
    company_name: zod.string(),
    phone: zod.string(),
    job_title: zod.string().optional(),
  })
  .strict();

type AcmePayload = zod.infer<typeof acmePayloadSchema>;

export const toSalesforce = flow({
  stableKey: "to-salesforce",
  name: "To Salesforce",
  description: "Sync data to Salesforce from Acme.",
  onTrigger: async (context, payload) => {
    // If the payload is invalid, this will throw an error and fail the trigger
    acmePayloadSchema.parse(payload.body.data);
    return Promise.resolve({ payload });
  },
  onExecution: async (context, params) => {
    // Create an authenticated Salesforce client
    const sfdcClient = createSalesforceClient(
      context.configVars["Salesforce Connection"],
      context.debug.enabled
    );

    const acmePayload = params.onTrigger.results.body.data as AcmePayload;

    // Get the field mapping that the user configured
    const fieldMapping = context.configVars[
      "Salesforce Field Mapping"
    ] as FieldMapping[];

    // Map Acme fields to Salesforce fields based on the field mapping
    const mappedFields = Object.keys(acmePayload).reduce((acc, acmeField) => {
      const mapping = fieldMapping.find(
        (mapping) => mapping.acme === acmeField
      );
      if (mapping) {
        return {
          ...acc,
          [mapping.salesforce]: acmePayload[acmeField as keyof AcmePayload],
        };
      }
      return acc;
    }, {});

    if (context.debug.enabled) {
      `Mapped fields for Salesforce: ${JSON.stringify(mappedFields)}`;
    }

    if (acmePayload.external_id) {
      // If an external_id is provided, update the Salesforce record
      await sfdcClient
        .sobject(
          util.types.toString(context.configVars["Salesforce Record Type"])
        )
        .update({ Id: acmePayload.external_id, ...mappedFields });
    } else {
      // Otherwise, create a new Salesforce record
      await sfdcClient
        .sobject(
          util.types.toString(context.configVars["Salesforce Record Type"])
        )
        .create(mappedFields);
    }

    return Promise.resolve({ data: null });
  },
});

export default toSalesforce;
