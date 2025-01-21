import { input, pollingTrigger, trigger, util } from "@prismatic-io/spectral";
import { listChanges, type ListChangesResult } from "./actions/changes";
import crypto from "crypto";

const dropboxWebhook = trigger({
  display: {
    label: "Webhook",
    description:
      "Receive and validate webhook requests from Dropbox for webhooks you configure.",
  },
  allowsBranching: true,
  staticBranchNames: ["Notification", "Verification Request"],
  inputs: {
    signingSecret: input({
      label: "Signing Secret",
      type: "password",
      required: true,
      comments: "The 'App Secret' of your Dropbox app",
      clean: util.types.toString,
    }),
  },
  perform: async (context, payload, params) => {
    // If it's an initial verification request, process it and stop
    if (payload.queryParameters?.challenge) {
      return Promise.resolve({
        payload,
        response: {
          statusCode: 200,
          contentType: "text/plain",
          body: payload.queryParameters.challenge,
        },
        branch: "Verification Request",
      });
    }

    // Verify the signing secret is correct
    const requestBody = util.types.toString(payload.rawBody.data);
    const computedSignature = crypto
      .createHmac("sha256", params.signingSecret)
      .update(requestBody, "utf8")
      .digest("hex");
    const payloadSignature = util.types.toString(
      payload.headers["X-Dropbox-Signature"]
    );
    if (payloadSignature !== computedSignature) {
      throw new Error(
        "Error validating message signature. Check your signing secret and verify that this message came from Dropbox."
      );
    }

    return Promise.resolve({
      payload,
      branch: "Notification",
    });
  },
  synchronousResponseSupport: "invalid",
  scheduleSupport: "invalid",
});

const pollChangesTrigger = pollingTrigger({
  display: {
    label: "New and Updated Files",
    description: "Checks for new and updated files on a configured schedule.",
  },
  pollAction: listChanges,
  perform: async ({ logger, polling }, payload, params) => {
    const { debug } = params;
    const actionReturn = await polling.invokeAction(params);
    const data = actionReturn.data as ListChangesResult;
    let polledNoChanges = true;

    if (debug) {
      logger.debug("Action response data:", actionReturn.data);
    }

    if (data.entries.length > 0) {
      if (debug) {
        logger.debug("New changes detected.");
      }
      polledNoChanges = false;
    }

    return Promise.resolve({
      payload: { ...payload, body: { data } },
      instanceState: actionReturn.instanceState,
      polledNoChanges,
    });
  },
  examplePayload: {
    instanceState: { stepId: "someStepId" },
    polledNoChanges: false,
    payload: {
      headers: {
        "prismatic-invoke-type": "Integration Flow Test",
        "Content-Type": "application/json",
        "Prismatic-Synchronous": "false",
      },
      queryParameters: null,
      rawBody: {
        data: null,
      },
      body: {
        data: {
          entries: [
            {
              ".tag": "deleted",
              name: "example_deleted_file.png",
              path_lower: "/testsubfolder/example_deleted_file.png",
              path_display: "/TestSubfolder/example_deleted_file.png",
            },
            {
              ".tag": "file",
              name: "example_added_file.png",
              path_lower: "/testsubfolder/example_added_file.png",
              path_display: "/TestSubfolder/example_added_file.png",
              id: "id:someExampleId",
              client_modified: "2024-11-20T18:29:39Z",
              server_modified: "2024-11-21T18:07:17Z",
              rev: "01627702307738900000002a67d8f21",
              size: 331590,
              is_downloadable: true,
              content_hash: "exampleContentHashValue",
            },
          ],
          cursor: "examplePaginationCursorValue",
          has_more: false,
        },
      },
      pathFragment: "",
      webhookUrls: {
        "Flow 1": "https://hooks.prismatic.io/trigger/WEBHOOK_ID",
      },
      webhookApiKeys: {
        "Flow 1": ["sample-api-key"],
      },
      invokeUrl: "https://hooks.prismatic.io/trigger/WEBHOOK_ID",
      executionId: "exampleExecutionId",
      customer: {
        id: "testCustomerId",
        name: "Test Customer",
        externalId: "testCustomerExternalId",
      },
      instance: {
        id: "testInstanceId",
        name: "Test Instance",
      },
      user: {
        id: "testUserId",
        email: "testUserEmail@example.com",
        name: "Test User",
        externalId: "testUserExternalId",
      },
      integration: {
        id: "testIntegrationId",
        name: "Test Integration",
        versionSequenceId: "testIntegrationVersionSequenceId",
        externalVersion: "testExternalVersion",
      },
      flow: {
        id: "testFlowId",
        name: "Test Flow Name",
      },
      startedAt: "2024-11-21 18:07:22.778766+00",
    },
  },
});

export default { dropboxWebhook, pollChangesTrigger };
