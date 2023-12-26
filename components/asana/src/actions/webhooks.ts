import { action, input, util } from "@prismatic-io/spectral";
import axios from "axios";
import { createAsanaClient } from "../client";
import {
  connectionInput,
  limit,
  offset,
  validateId,
  workspaceId,
  filter,
} from "../inputs";

interface AsanaWebhook {
  gid: string;
  active: boolean;
  resource: {
    gid: string;
    name: string;
    resource_type: string;
  };
  resource_type: string;
  target: string;
}

interface WebhookResponse {
  data: {
    data: AsanaWebhook[];
    next_page: {
      offset: string;
      path: string;
      uri: string;
    };
  };
}

const listWebhooks = action({
  display: {
    label: "List Workspace Webhooks",
    description:
      "List all webhooks configured in Asana, including those for other integrations",
  },
  inputs: {
    asanaConnection: connectionInput,
    workspaceId,
    showOnlyInstanceWebhooks: input({
      label: "Show only instance webhooks",
      comments: "Show only webhooks that point to this instance",
      type: "boolean",
      default: "true",
      clean: util.types.toBool,
    }),
    limit,
    offset,
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.get("/webhooks", {
      params: {
        workspace: params.workspaceId,
        limit: params.limit,
        offset: params.offset,
      },
    });
    if (params.showOnlyInstanceWebhooks) {
      const instanceWebhookUrls = Object.values(context.webhookUrls);
      return {
        data: (data.data || []).filter((webhook: AsanaWebhook) =>
          instanceWebhookUrls.includes(webhook.target)
        ),
      };
    }
    return { data: data.data };
  },
  examplePayload: {
    data: [
      {
        gid: "1202700984385446",
        active: true,
        resource: {
          gid: "1202467472002605",
          name: "Brand redesign campaign",
          resource_type: "project",
        },
        resource_type: "webhook",
        target: "https://hooks.prismatic.io/trigger/EXAMPLE",
      },
    ],
  },
});

const createWebhook = action({
  display: {
    label: "Create Webhook",
    description: "Create a webhook to send data from Asana to an instance URL",
  },
  inputs: {
    endpoint: input({
      label: "Webhook URL",
      comments: "Reference a flow's URL from the trigger payload",
      type: "string",
      required: true,
    }),
    resourceId: input({
      label: "Resource ID",
      comments:
        "The GID of a project, portfolio, goal, task, etc - the resource to listen for",
      type: "string",
      example: "375893453",
      required: true,
      clean: validateId,
    }),
    filter,
    asanaConnection: connectionInput,
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);

    try {
      const { data } = await client.post("/webhooks", {
        data: {
          resource: params.resourceId,
          target: params.endpoint,
          filters: params.filter || undefined,
        },
      });
      return { data };
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (
          err.response?.data?.errors?.[0]?.message?.includes(
            "Duplicated webhook"
          )
        ) {
          console.warn(
            `Skipping creation of webhook. A webhook with resource (${params.resourceId}) and target (${params.endpoint}) already exists.`
          );
          return;
        }
      }
      throw err;
    }
  },
});

const deleteWebhook = action({
  display: {
    label: "Delete Webhook",
    description: "Delete a webhook by ID",
  },
  inputs: {
    asanaConnection: connectionInput,
    webhookId: {
      label: "Webhook ID",
      type: "string",
      example: "375893453",
      comments: "The gid of the workspace",
      required: true,
      clean: validateId,
    },
  },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);
    const { data } = await client.delete(`/webhooks/${params.webhookId}`);
    return { data };
  },
  examplePayload: { data: {} },
});

const deleteInstanceWebhooks = action({
  display: {
    label: "Delete Instance Webhooks",
    description:
      "Delete all Asana webhooks that point to a flow in this instance",
  },
  inputs: { asanaConnection: connectionInput, workspaceId },
  perform: async (context, params) => {
    const client = await createAsanaClient(params.asanaConnection);

    let webhooks: AsanaWebhook[] = [];
    let offset = undefined;
    let stop = false;
    while (!stop) {
      const response: WebhookResponse = await client.get("/webhooks", {
        params: { workspace: params.workspaceId, limit: "100", offset: offset },
      });
      webhooks = [...webhooks, ...response.data.data];
      offset = response.data.next_page?.offset;
      if (!offset) {
        stop = true;
      }
    }

    const instanceWebhookUrls = Object.values(context.webhookUrls);
    const instanceWebhooks = webhooks.filter((webhook) =>
      instanceWebhookUrls.includes(webhook.target)
    );

    for (const webhook of instanceWebhooks) {
      context.logger.info(`Deleting webhook ${webhook.gid}...`);
      await client.delete(`/webhooks/${webhook.gid}`);
    }

    return { data: {} };
  },
});

export default {
  createWebhook,
  deleteWebhook,
  deleteInstanceWebhooks,
  listWebhooks,
};
