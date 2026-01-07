import type {
  ActionContext,
  TriggerPayload,
  Connection,
} from "@prismatic-io/spectral";
import { trigger, util } from "@prismatic-io/spectral";
import {
  createWebhook,
  deleteWebhook,
  getAdditionalData,
  getFilters,
  isHeartbeatData,
  validateHmac,
} from "./utils";
import {
  connectionInput,
  projectId,
  workspaceId,
  triggerWhenAdded,
  triggerWhenChanged,
  triggerWhenDeleted,
  triggerWhenRemoved,
  triggerWhenUndeleted,
} from "../inputs";

const performFunction = async (
  context: ActionContext,
  payload: TriggerPayload,
  inputs: { asanaConnection: Connection },
): Promise<{
  payload: TriggerPayload;
  branch: string;
}> => {
  const headers = util.types.lowerCaseHeaders(payload.headers);
  const webhookSecret = headers["x-hook-secret"];

  if (webhookSecret) {
    // This is the first time a webhook has been sent.
    // Save the secret off for later use in HMAC validation.
    return Promise.resolve({
      payload,
      response: {
        statusCode: 200,
        headers: {
          "X-Hook-Secret": webhookSecret,
        },
        contentType: "text/plain",
      },
      branch: "URL Verify",
      instanceState: { webhookSecret },
    });
  } else {
    // It's a normal notification or heartbeat. We need to validate HMAC
    if (!context.isSimulatedTestExecution) {
      validateHmac(payload, headers["x-hook-signature"], [
        util.types.toString(context.instanceState["webhookSecret"]),
      ]);
    }

    if (isHeartbeatData(payload.body.data)) {
      // Asana sent a "Heartbeat" event https://developers.asana.com/docs/webhook-heartbeat-events
      context.logger.debug("Asana Heartbeat received");
      return Promise.resolve({
        payload,
        branch: "URL Verify",
      });
    } else {
      return Promise.resolve({
        payload: await getAdditionalData(context, payload, inputs),
        branch: "Notification",
      });
    }
  }
};

const workspaceProjectsTrigger = trigger({
  display: {
    label: "Workspace Projects Trigger",
    description:
      "Get notified when a project is created, updated, or deleted in a workspace.",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "URL Verify"],
  inputs: {
    asanaConnection: connectionInput,
    workspaceId,
    triggerWhenAdded: {
      ...triggerWhenAdded,
      comments:
        "Determines if the webhook will trigger when a project is added.",
    },
    triggerWhenChanged: {
      ...triggerWhenChanged,
      comments:
        "Determines if the webhook will trigger when a project is changed.",
    },
    triggerWhenDeleted: {
      ...triggerWhenDeleted,
      comments:
        "Determines if the webhook will trigger when a project is deleted.",
    },
    triggerWhenRemoved: {
      ...triggerWhenRemoved,
      comments:
        "Determines if the webhook will trigger when a project is removed.",
    },
    triggerWhenUndeleted: {
      ...triggerWhenUndeleted,
      comments:
        "Determines if the webhook will trigger when a project is undeleted.",
    },
  },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
  perform: performFunction,
  webhookLifecycleHandlers: {
    create: async (
      context,
      {
        triggerWhenAdded,
        triggerWhenChanged,
        triggerWhenDeleted,
        triggerWhenRemoved,
        triggerWhenUndeleted,
        asanaConnection,
        workspaceId,
      },
    ) => {
      const endpoint = context.webhookUrls[context.flow.name];

      await createWebhook({
        asanaConnection: asanaConnection,
        endpoint,
        resourceId: workspaceId,
        filters: getFilters(
          {
            triggerWhenAdded,
            triggerWhenChanged,
            triggerWhenDeleted,
            triggerWhenRemoved,
            triggerWhenUndeleted,
          },
          "project",
        ),
      });
    },
    delete: async (context, params) => {
      const endpoint = context.webhookUrls[context.flow.name];
      await deleteWebhook({
        asanaConnection: params.asanaConnection,
        endpoint,
        resourceId: params.workspaceId,
      });
    },
  },
});

const projectTasksTrigger = trigger({
  display: {
    label: "Project Tasks Trigger",
    description:
      "Get notified when a task is created, updated, or deleted in a project.",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "URL Verify"],
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    triggerWhenAdded: {
      ...triggerWhenAdded,
      comments: "Determines if the webhook will trigger when a task is added.",
    },
    triggerWhenChanged: {
      ...triggerWhenChanged,
      comments:
        "Determines if the webhook will trigger when a task is changed.",
    },
    triggerWhenDeleted: {
      ...triggerWhenDeleted,
      comments:
        "Determines if the webhook will trigger when a task is deleted.",
    },
    triggerWhenRemoved: {
      ...triggerWhenRemoved,
      comments:
        "Determines if the webhook will trigger when a task is removed.",
    },
    triggerWhenUndeleted: {
      ...triggerWhenUndeleted,
      comments:
        "Determines if the webhook will trigger when a task is undeleted.",
    },
  },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
  perform: performFunction,
  webhookLifecycleHandlers: {
    create: async (
      context,
      {
        triggerWhenAdded,
        triggerWhenChanged,
        triggerWhenDeleted,
        triggerWhenRemoved,
        triggerWhenUndeleted,
        asanaConnection,
        projectId,
      },
    ) => {
      const endpoint = context.webhookUrls[context.flow.name];

      await createWebhook({
        asanaConnection: asanaConnection,
        endpoint,
        resourceId: projectId,
        filters: getFilters(
          {
            triggerWhenAdded,
            triggerWhenChanged,
            triggerWhenDeleted,
            triggerWhenRemoved,
            triggerWhenUndeleted,
          },
          "task",
        ),
      });
    },
    delete: async (context, params) => {
      const endpoint = context.webhookUrls[context.flow.name];
      await deleteWebhook({
        asanaConnection: params.asanaConnection,
        endpoint,
        resourceId: params.projectId,
      });
    },
  },
});

const storiesTrigger = trigger({
  display: {
    label: "Comments & Activity Trigger",
    description:
      "Get notified when a comment or activity (task updates, changes, etc.) is created, updated, or deleted in a project.",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "URL Verify"],
  inputs: {
    asanaConnection: connectionInput,
    projectId,
    triggerWhenAdded: {
      ...triggerWhenAdded,
      comments:
        "Determines if the webhook will trigger when a comment or activity is added.",
    },
    triggerWhenChanged: {
      ...triggerWhenChanged,
      comments:
        "Determines if the webhook will trigger when a comment or activity is changed.",
    },
    triggerWhenDeleted: {
      ...triggerWhenDeleted,
      comments:
        "Determines if the webhook will trigger when a comment or activity is deleted.",
    },
    triggerWhenRemoved: {
      ...triggerWhenRemoved,
      comments:
        "Determines if the webhook will trigger when a comment or activity is removed.",
    },
    triggerWhenUndeleted: {
      ...triggerWhenUndeleted,
      comments:
        "Determines if the webhook will trigger when a comment or activity is undeleted.",
    },
  },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
  perform: performFunction,
  webhookLifecycleHandlers: {
    create: async (
      context,
      {
        triggerWhenAdded,
        triggerWhenChanged,
        triggerWhenDeleted,
        triggerWhenRemoved,
        triggerWhenUndeleted,
        asanaConnection,
        projectId,
      },
    ) => {
      const endpoint = context.webhookUrls[context.flow.name];

      await createWebhook({
        asanaConnection: asanaConnection,
        endpoint,
        resourceId: projectId,
        filters: getFilters(
          {
            triggerWhenAdded,
            triggerWhenChanged,
            triggerWhenDeleted,
            triggerWhenRemoved,
            triggerWhenUndeleted,
          },
          "story",
        ),
      });
    },
    delete: async (context, params) => {
      const endpoint = context.webhookUrls[context.flow.name];
      await deleteWebhook({
        asanaConnection: params.asanaConnection,
        endpoint,
        resourceId: params.projectId,
      });
    },
  },
});

export default {
  projectTasksTrigger,
  workspaceProjectsTrigger,
  storiesTrigger,
};
