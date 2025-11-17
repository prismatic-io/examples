/**
 * Handlers for Prismatic instance lifecycle events
 */

import { getInstanceDetails } from "./prismatic";
import db from "./database";

// Helper function to delete all webhooks for a given instance
// Used by both instance.deleted and instance.updated handlers
const deleteWebhooksForInstance = async (instanceId: string) => {
  await new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM webhooks WHERE instance_id = ?`,
      [instanceId],
      (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      },
    );
  });
};

// Helper function to enable or disable all webhooks for a given instance
const setWebhooksEnabledDisabled = async (
  instanceId: string,
  enabled: boolean,
) => {
  await new Promise((resolve, reject) => {
    db.run(
      `UPDATE webhooks SET enabled = ? WHERE instance_id = ?`,
      [enabled ? 1 : 0, instanceId],
      (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      },
    );
  });
};

// Handler for instance.updated event
export const handleInstanceUpdated = async (instanceId: string) => {
  const instance = await getInstanceDetails(instanceId);
  await deleteWebhooksForInstance(instanceId);
  for (const flowConfig of instance.flowConfigs.nodes) {
    console.debug(
      `Inserting webhook for customer ${instance.customer.externalId} and flow ${flowConfig.flow.name}`,
    );
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO webhooks (customer_id, integration_name, instance_id, flow_name, webhook_url) VALUES (?, ?, ?, ?, ?)`,
        [
          instance.customer.externalId,
          instance.integration.name,
          instanceId,
          flowConfig.flow.name,
          flowConfig.webhookUrl,
        ],
        (err: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        },
      );
    });
  }
};

// Handler for instance.enabled event
export const handleInstanceEnabled = async (instanceId: string) => {
  console.debug(`Enabling webhooks for instance ${instanceId}`);
  await setWebhooksEnabledDisabled(instanceId, true);
};

// Handler for instance.disabled event
export const handleInstanceDisabled = async (instanceId: string) => {
  console.debug(`Disabling webhooks for instance ${instanceId}`);
  await setWebhooksEnabledDisabled(instanceId, false);
};

// Handler for instance.deleted event
export const handleInstanceDeleted = async (instanceId: string) => {
  console.debug(`Deleting webhooks for instance ${instanceId}`);
  await deleteWebhooksForInstance(instanceId);
};
