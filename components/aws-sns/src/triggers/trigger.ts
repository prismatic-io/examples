import { trigger, util } from "@prismatic-io/spectral";
import { createClient as createHttpClient } from "@prismatic-io/spectral/dist/clients/http";
import MessageValidator from "sns-validator";
import { parseMessage } from "../inputs";
import { snsExamplePayload } from "./exampleNotification";

export const lowerCaseHeaders = (
  headers: Record<string, string>
): Record<string, string> =>
  Object.entries(headers).reduce((result, [key, val]) => {
    return { ...result, [key.toLowerCase()]: val };
  }, {});

export const subscriptionTrigger = trigger({
  display: {
    label: "Subscription Trigger",
    description:
      "Confirm subscription and unsubscribe requests and validate SNS messages",
  },
  inputs: { parseMessage },
  scheduleSupport: "invalid",
  synchronousResponseSupport: "valid",
  allowsBranching: true,
  staticBranchNames: ["Notification", "Subscribe", "Unsubscribe"],
  examplePayload: {
    payload: snsExamplePayload,
    branch: "Notification",
  },
  perform: async ({ logger }, payload, params) => {
    const validator = new MessageValidator();

    const originalHeaders = payload.headers;
    payload.headers = lowerCaseHeaders(payload.headers);

    const _parseMessage =
      payload.headers["x-amz-sns-message-type"] === "Notification" &&
      util.types.toBool(params.parseMessage);

    const validateMessage = async ({ rawBody: { data }, headers }) => {
      if (headers["x-amz-sns-rawdelivery"] === "true") {
        return _parseMessage
          ? JSON.parse(util.types.toString(data) || "{}")
          : util.types.toString(data);
      }
      return await new Promise((resolve, reject) => {
        validator.validate(util.types.toString(data), (error, message) => {
          if (error) {
            logger.error(
              `SNS Message could not be verified with error: ${error}`
            );
            return reject(error);
          }
          return resolve(message);
        });
      });
    };

    const message = await validateMessage(payload);

    //FIXME - Is there a way to get rid of the usage of let here?
    let branch = "";

    const messageType = payload.headers["x-amz-sns-message-type"];
    switch (messageType) {
      case "SubscriptionConfirmation":
        await createHttpClient({
          baseUrl: message["SubscribeURL"],
        }).get("");
        branch = "Subscribe";
        break;
      case "UnsubscribeConfirmation":
        await createHttpClient({
          baseUrl: message["SubscribeURL"],
        }).get("");
        branch = "Unsubscribe";
        break;
      case "Notification":
        branch = "Notification";
        break;
      default:
        throw new Error(
          `Message type was not "Notification", "SubscriptionConfirmation" or "UnsubscribeConfirmation", but "${messageType}" instead.`
        );
    }

    // Parse non-raw message data
    if (_parseMessage && payload.headers["x-amz-sns-rawdelivery"] !== "true") {
      try {
        message["Message"] = JSON.parse(
          util.types.toString(message["Message"])
        );
      } catch {
        throw new Error(
          `Received a message that is not valid JSON: ${message["Message"]}`
        );
      }
    }

    payload.headers = originalHeaders;

    return {
      // Return a deserialized message as payload.body.data
      branch,
      payload: {
        ...payload,
        body: {
          data: message,
        },
      },
    };
  },
});

export default { subscriptionTrigger };
