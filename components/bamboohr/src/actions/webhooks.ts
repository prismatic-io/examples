import { action, input, util } from "@prismatic-io/spectral";
import { createBambooClient } from "../client";
import { connectionInput } from "../inputs";

// These are the fields that a user can "listen" for changes on.
const webhookFields = [
  "firstName",
  "lastName",
  "hireDate",
  "department",
  "middleName",
  "dateOfBirth",
  "ssn",
  "address1",
  "address2",
  "city",
  "state",
  "zipcode",
  "mobilePhone",
  "homePhone",
  "workEmail",
  "jobTitle",
  "location",
  "gender",
  "maritalStatus",
  "payType",
  "eeo",
  "status",
  "workPhone",
  "workPhoneExtension",
  "employeeNumber",
  "ethnicity",
  "division",
  "homeEmail",
  "preferredName",
  "employeeStatusDate",
  "country",
  "payChangeReason",
  "payRateEffectiveDate",
  "exempt",
  "twitterFeed",
  "facebook",
  "linkedIn",
  "pinterest",
  "acaStatus",
  "payPer",
  "originalHireDate",
  "paySchedule",
  "instagram",
  "allergies",
  "dietaryRestrictions",
  "hoursPerPayCycle",
];

// Wraps https://documentation.bamboohr.com/reference/get-webhook-list
const listWebhooks = action({
  display: {
    label: "List Webhooks",
    description: "Get a list of existing webhooks",
  },
  inputs: {
    connection: connectionInput,
    showOnlyInstanceWebhooks: input({
      label: "Show only instance webhooks",
      comments: "Show only webhooks that point to this instance",
      type: "boolean",
      default: "true",
      clean: util.types.toBool,
    }),
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const {
      data: { webhooks },
    } = await client.get("/v1/webhooks");
    if (params.showOnlyInstanceWebhooks) {
      const instanceWebhookUrls = Object.values(context.webhookUrls);
      return {
        data: (webhooks || []).filter((webhook) =>
          instanceWebhookUrls.includes(webhook.url)
        ),
      };
    }
    return { data: webhooks || [] };
  },
});

// Wraps https://documentation.bamboohr.com/reference/post-webhook
const createWebhook = action({
  display: {
    label: "Create Webhook",
    description: "Create a new webhook",
  },
  inputs: {
    connection: connectionInput,
    name: input({ label: "Webhook Name", required: true, type: "string" }),
    url: input({
      label: "Callback URL",
      required: true,
      comments: "Where the data should be sent",
      type: "string",
    }),
    monitorFields: input({
      label: "Fields to Monitor",
      required: true,
      comments: `Select one or more fields to trigger this webhook on. This can be any of the following: ${webhookFields.join(
        ", "
      )}`,
      type: "string",
      collection: "valuelist",
      model: webhookFields.map((field) => ({ label: field, value: field })),
    }),
    allowDuplicates: input({
      label: "Allow Duplicates?",
      type: "boolean",
      default: "false",
      comments:
        "By default this action checks if a webhook with this callback and sheet ID already exists. If it does, this action does not configure a new webhook. Toggle this to true to allow the creation of duplicate webhooks.",
      clean: util.types.toBool,
    }),
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);

    // Check if duplicate exist
    if (!params.allowDuplicates) {
      const {
        data: { webhooks: allWebhooks },
      } = await client.get("/v1/webhooks");
      const existingWebhooks = allWebhooks.filter(
        (webhook) => params.url === webhook.url
      );
      if (existingWebhooks.length > 0) {
        context.logger.info(
          "A webhook with those parameters already exists. Skipping webhook creation and returning existing webhook."
        );
        const { data: webhookData } = await client.get(
          `/v1/webhooks/${existingWebhooks[0].id}/`
        );
        return {
          data: webhookData,
        };
      }
    }

    // If duplicates are allowed, or no duplicates exist, continue with creating a new webhook
    const postFields = Object.fromEntries(
      webhookFields.map((field) => [field, field])
    );

    const { data } = await client.post("/v1/webhooks", {
      name: params.name,
      monitorFields: params.monitorFields,
      postFields,
      url: params.url,
      format: "json",
    });

    // Save the new webhook's private key for use by the trigger
    const webhookSecrets = Array.isArray(
      context.crossFlowState["webhookSecrets"]
    )
      ? [...context.crossFlowState["webhookSecrets"], data.privateKey]
      : [data.privateKey];

    return { data, crossFlowState: { webhookSecrets } };
  },
});

// Wraps https://documentation.bamboohr.com/reference/delete-webhook
const deleteWebhookById = action({
  display: {
    label: "Delete Webhook",
    description: "Delete a webhook by ID",
  },
  inputs: {
    connection: connectionInput,
    webhookId: input({ label: "Webhook ID", type: "string", required: true }),
  },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const { data } = await client.delete(`/v1/webhooks/${params.webhookId}/`);
    return { data };
  },
});

// Remove all webhooks pointed to this instance
const deleteInstanceWebhooks = action({
  display: {
    label: "Delete Instance Webhooks",
    description:
      "Delete all BambooHR webhooks that point to a flow in this instance",
  },
  inputs: { connection: connectionInput },
  perform: async (context, params) => {
    const client = createBambooClient(params.connection);
    const {
      data: { webhooks },
    } = await client.get("/v1/webhooks");

    // Get webhooks pointing to this instance
    const instanceWebhookUrls = Object.values(context.webhookUrls);
    const instanceBambooWebhooks = webhooks.filter((webhook) =>
      instanceWebhookUrls.includes(webhook.url)
    );

    // Delete each BambooHR webhook
    for (const webhook of instanceBambooWebhooks) {
      context.logger.info(`Deleting webhook ${webhook.id}...`);
      await client.delete(`/v1/webhooks/${webhook.id}/`);
    }
    return { data: null };
  },
});

export default {
  createWebhook,
  deleteInstanceWebhooks,
  deleteWebhookById,
  listWebhooks,
};
