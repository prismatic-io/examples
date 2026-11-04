import crypto from "node:crypto";
import { ActionLogger, util } from "@prismatic-io/spectral";
import type { Connection, Schema } from "jsforce";
import type { SaveResult } from "jsforce/lib/api/metadata/schema";
import type { FlowMetadata } from "./types";

/**
 * This module replicates, in code-native form, the Salesforce custom component
 * trigger that subscribes to record changes via an outbound message:
 * https://github.com/prismatic-io/components/blob/main/components/salesforce/src/triggers/flowOutboundMessageTrigger.ts
 *
 * On deploy we create two Salesforce Metadata API resources:
 *   1. A WorkflowOutboundMessage that POSTs changed records to our webhook URL.
 *   2. A record-triggered Flow that fires that outbound message.
 * On delete we deactivate and remove both. The identifiers are persisted in
 * `crossFlowState` between deploy and delete (see flows.ts).
 */

// ---------------------------------------------------------------------------
// Naming helpers
// ---------------------------------------------------------------------------

/**
 * Salesforce webhook URLs end with a unique, opaque identifier. We use that
 * trailing segment as a stable key for the resources tied to this instance.
 */
export const getWebhookId = (url: string): string => {
  const match = /\/([^/]+)$/.exec(url);
  return match ? match[1] : "";
};

/**
 * Build a deterministic, Salesforce-safe resource name from a prefix and a
 * unique value (the webhook id). Hashing keeps the name short and valid while
 * remaining stable across redeploys of the same instance.
 */
export const generatePrefixedName = (
  prefix: string,
  uniqueValue: string,
): string => {
  const hash = crypto
    .createHash("md5")
    .update(uniqueValue)
    .digest("hex")
    .substring(0, 20);
  return `${prefix}_${hash}`;
};

/** Salesforce API names allow only letters, numbers, and underscores. */
const toApiName = (name: string): string =>
  name
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_");

/** Combine an object and a name into a Metadata API fullName, e.g. `Lead.My_Message`. */
const toFullName = (objectType: string, name: string): string =>
  `${objectType}.${name.split(/\s+/g).join("_")}`;

/** The object prefix of a fullName (`Lead` from `Lead.My_Message`), or "". */
const getObjectPrefix = (fullName: string): string => {
  const parts = fullName.split(".");
  return parts.length > 1 ? parts[0] : "";
};

/** The name portion of a fullName (`My_Message` from `Lead.My_Message`). */
const removeObjectPrefix = (fullName: string): string => {
  const parts = fullName.split(".");
  return parts.length > 1 ? parts.slice(1).join(".") : fullName;
};

// ---------------------------------------------------------------------------
// Metadata API result handling
// ---------------------------------------------------------------------------

const formatErrors = (result: SaveResult): string =>
  result.errors
    .filter(Boolean)
    .map(({ statusCode, message, fields }) =>
      [statusCode, message, fields.join(", ")].filter(Boolean).join(" - "),
    )
    .join("\n\n");

/** Throw if a Metadata API save/delete failed; otherwise return the result. */
const assertMetadataSuccess = (result: SaveResult): SaveResult => {
  if (result.success) {
    return result;
  }
  throw new Error(formatErrors(result));
};

/**
 * Tolerant variant used during teardown: if the only error is that the resource
 * is already gone (matched via `alreadyGoneError`), log and move on instead of
 * throwing. This keeps delete idempotent across retries and partial deploys.
 */
const assertMetadataSuccessOrAbsent = (
  result: SaveResult,
  logger: ActionLogger,
  absentLogMessage: string,
  alreadyGoneError: string,
): void => {
  if (result.success) {
    return;
  }
  const alreadyGone = result.errors
    .filter(Boolean)
    .some(({ message }) =>
      message.toLowerCase().includes(alreadyGoneError.toLowerCase()),
    );
  if (alreadyGone) {
    logger.info(absentLogMessage);
    return;
  }
  throw new Error(formatErrors(result));
};

/**
 * Look up the org's namespace prefix, if any. Namespaced (managed-package) orgs
 * silently prepend this prefix to created resources, so we need it to address
 * the outbound message correctly when deleting it.
 */
const getOrgNamespacePrefix = async (
  client: Connection<Schema>,
  logger: ActionLogger,
): Promise<string> => {
  try {
    const result = await client.query(
      "SELECT NamespacePrefix FROM Organization LIMIT 1",
    );
    const prefix = (result?.records?.[0] as { NamespacePrefix?: string | null })
      ?.NamespacePrefix;
    return prefix || "";
  } catch (error) {
    logger.warn("Unable to retrieve Organization NamespacePrefix:", error);
    return "";
  }
};

// ---------------------------------------------------------------------------
// Resource creation
// ---------------------------------------------------------------------------

export interface CreateSubscriptionParams {
  client: Connection<Schema>;
  /** Generated, prefixed name shared by the outbound message and the flow. */
  name: string;
  /** Webhook URL Salesforce will POST changed records to. */
  endpointUrl: string;
  /** Salesforce object whose changes we subscribe to (e.g. "Lead"). */
  triggerObject: string;
  /** When to fire: "Create", "Update", or "CreateAndUpdate". */
  triggerOn: string;
  /** Field API names to include in the outbound message payload. */
  fields: string[];
  /** Metadata API version to stamp on the outbound message. */
  version: string;
}

/**
 * Create the outbound message and the record-triggered Flow that fires it.
 * Returns the fullNames of both resources so the caller can persist them.
 */
export const createFlowRecordSubscription = async ({
  client,
  name,
  endpointUrl,
  triggerObject,
  triggerOn,
  fields,
  version,
}: CreateSubscriptionParams): Promise<{
  flowFullName: string;
  outboundMessageFullName: string;
}> => {
  // Salesforce sends outbound messages as the "integration user" — the user
  // whose credentials authorized this connection.
  const { username: integrationUser } = await client.identity();

  // 1. Create the outbound message that POSTs changed records to our webhook.
  //    `fields` is de-duplicated because Salesforce rejects an outbound message
  //    that lists the same field twice.
  const outboundMessageResult = assertMetadataSuccess(
    await client.metadata.create("WorkflowOutboundMessage", {
      fullName: toFullName(triggerObject, name),
      name,
      description: `Outbound message for ${name}.`,
      apiVersion:
        util.types.toNumber(version) || util.types.toNumber(client.version),
      endpointUrl,
      integrationUser,
      fields: [...new Set(fields)],
      protected: false,
      includeSessionId: false,
    }),
  );
  const outboundMessageFullName = outboundMessageResult.fullName;

  // 2. Create a record-triggered Flow whose only action fires the outbound
  //    message. Salesforce requires the action to reference the outbound
  //    message by its bare name (without the object prefix).
  const outboundMessageName = removeObjectPrefix(outboundMessageFullName);
  // The action that fires the message is named "Send_<message>". Strip any
  // leading "Send_" from the message name first so we never produce "Send_Send_".
  const actionCallName = `Send_${outboundMessageName.replace(/^Send_/i, "")}`;
  const flowFullNameApi = toApiName(name);

  const flowMetadata: FlowMetadata = {
    fullName: flowFullNameApi,
    label: name,
    description: `Flow for ${name}.`,
    // The outbound-message action requires the Flow to be at API v53 or later.
    // Set it explicitly so the Flow isn't created at the client's default version.
    apiVersion:
      util.types.toNumber(version) || util.types.toNumber(client.version),
    processType: "AutoLaunchedFlow",
    runInMode: "DefaultMode",
    status: "Active",
    processMetadataValues: [
      { name: "CanvasMode", value: { stringValue: "AUTO_LAYOUT_CANVAS" } },
    ],
    environments: "Default",
    // `start` defines the record-change event that launches the flow, and
    // `actionCalls` defines the single outbound-message action it runs. The
    // locationX/locationY values only position the nodes on the Flow Builder
    // canvas — they're cosmetic but required by the Metadata API.
    start: {
      locationX: 50,
      locationY: 0,
      connector: { targetReference: actionCallName },
      object: triggerObject,
      recordTriggerType: triggerOn,
      triggerType: "RecordAfterSave",
    },
    actionCalls: {
      name: actionCallName,
      label: `Send ${outboundMessageName.replace(/_/g, " ")}`,
      locationX: 176,
      locationY: 158,
      actionName: `${triggerObject}.${outboundMessageName}`,
      actionType: "outboundMessage",
    },
    variables: {
      name: "TriggeringRecord",
      dataType: "SObject",
      isCollection: false,
      isInput: true,
      isOutput: false,
      objectType: triggerObject,
    },
  };

  const flowResult = assertMetadataSuccess(
    await client.metadata.create("Flow", flowMetadata),
  );

  return {
    flowFullName: flowResult.fullName,
    outboundMessageFullName,
  };
};

// ---------------------------------------------------------------------------
// Resource teardown
// ---------------------------------------------------------------------------

/**
 * Deactivate and delete a previously created Flow and its outbound message.
 * A Flow must be deactivated (its active version cleared) before it can be
 * deleted. Each step tolerates an already-deleted resource so teardown is safe
 * to retry and safe to run after a partially completed deploy.
 */
export const deactivateAndDeleteFlowResources = async (
  client: Connection<Schema>,
  logger: ActionLogger,
  flowFullName: string,
  outboundMessageFullName: string,
): Promise<void> => {
  // Deactivate the Flow by clearing its active version number.
  assertMetadataSuccessOrAbsent(
    await client.metadata.update("FlowDefinition", {
      fullName: flowFullName,
      activeVersionNumber: null,
    }),
    logger,
    `Flow ${flowFullName} already deactivated`,
    "no FlowDefinition named",
  );
  logger.info(`Flow ${flowFullName} deactivated`);

  // Delete the now-inactive Flow.
  assertMetadataSuccessOrAbsent(
    await client.metadata.delete("Flow", flowFullName),
    logger,
    `Flow ${flowFullName} already deleted`,
    "no Flow named",
  );
  logger.info(`Flow ${flowFullName} deleted`);

  // Managed-package orgs prepend a namespace prefix to created resources, so
  // resolve it to address the outbound message correctly on delete.
  const namespacePrefix = await getOrgNamespacePrefix(client, logger);
  const outboundMessageToDelete = namespacePrefix
    ? toFullName(
        getObjectPrefix(outboundMessageFullName),
        `${namespacePrefix}__${removeObjectPrefix(outboundMessageFullName)}`,
      )
    : outboundMessageFullName;

  assertMetadataSuccessOrAbsent(
    await client.metadata.delete(
      "WorkflowOutboundMessage",
      outboundMessageToDelete,
    ),
    logger,
    `Outbound message ${outboundMessageFullName} already deleted`,
    "no WorkflowOutboundMessage named",
  );
  logger.info(`Outbound message ${outboundMessageFullName} deleted`);
};
